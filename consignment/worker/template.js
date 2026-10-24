const headers={'content-type':'text/html; charset=utf-8','cache-control':'no-store','x-content-type-options':'nosniff','referrer-policy':'same-origin','x-frame-options':'SAMEORIGIN'};
const page=(title,body,status=200)=>new Response(`<!doctype html><html lang="en"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${title} · maxcar.my</title><style>body{font:16px Arial;background:#f5f3ed;color:#182b27;max-width:460px;margin:12vh auto;padding:28px}h1{font:42px Georgia}a{display:inline-block;padding:15px 23px;border-radius:5px;background:#182b27;color:white;text-decoration:none}p{line-height:1.7}</style><h1>${title}</h1>${body}</html>`,{status,headers});
export default {async fetch(request,env){
 const path=new URL(request.url).pathname;
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405,headers:{allow:'GET, HEAD'}});
 let response;
 if(path==='/'||path==='/index.html') response=new Response(PUBLIC_PAGE,{headers});
 else if(path==='/cars'||path==='/cars/'||path==='/cars.html'||path==='/car.html') response=new Response(CARS_PAGE,{headers});
 else if(path==='/admin'||path==='/admin/'||path==='/admin.html'){
 const id=request.headers.get('oai-authenticated-user-id');const email=request.headers.get('oai-authenticated-user-email');
 if(!id||!email)response=page('Admin sign in','<p>Sign in with your approved ChatGPT account to manage car listings.</p><a href="/signin-with-chatgpt?return_to=%2Fadmin" target="_top">Sign in with ChatGPT</a><p><a href="/">Back to the collection</a></p>');
 else if(!env.ADMIN_EMAIL)response=page('Admin setup pending','<p>The site owner must configure an approved admin email before listing management is available.</p>',503);
 else if(email.trim().toLowerCase()!==env.ADMIN_EMAIL.trim().toLowerCase())response=page('Access restricted','<p>This account does not have admin permission.</p><a href="/signout-with-chatgpt?return_to=%2Fadmin" target="_top">Use a different account</a>',403);
 else response=new Response(ADMIN_PAGE,{headers});
 }else response=page('Page not found','<a href="/">Back to the collection</a>',404);
 return request.method==='HEAD'?new Response(null,{status:response.status,headers:response.headers}):response;
}};
