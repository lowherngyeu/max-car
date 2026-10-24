import {readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const source=readFileSync(new URL('../build/server/index.js',import.meta.url),'utf8');
const {default:worker}=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const request=(path,email)=>new Request('https://example.com'+path,{headers:email?{'oai-authenticated-user-id':'test-user','oai-authenticated-user-email':email}:{}});
const env={ADMIN_EMAIL:'owner@example.com'};
const publicResponse=await worker.fetch(request('/'),env);assert.equal(publicResponse.status,200);assert.ok(!(await publicResponse.text()).includes('id="add-car"'));
for(const path of ['/admin','/admin/','/admin.html']){
 const anonymous=await worker.fetch(request(path),env);const text=await anonymous.text();assert.ok(text.includes('Sign in with ChatGPT'));assert.ok(!text.includes('listing-form'));
 const denied=await worker.fetch(request(path,'other@example.com'),env);assert.equal(denied.status,403);assert.ok(!(await denied.text()).includes('listing-form'));
 const allowed=await worker.fetch(request(path,'owner@example.com'),env);assert.equal(allowed.status,200);assert.ok((await allowed.text()).includes('listing-form'));
 const unconfigured=await worker.fetch(request(path,'owner@example.com'),{});assert.equal(unconfigured.status,503);
}
assert.equal((await worker.fetch(request('/private/admin.html','owner@example.com'),env)).status,404);
console.log('Passed: public access, anonymous sign-in, unauthorized denial, admin access, missing configuration, private-file denial.');
