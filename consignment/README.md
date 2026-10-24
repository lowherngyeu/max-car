# maxcar.my

Used-car consignment website source and a downloadable local preview. This repository stores the project; no website hosting or GitHub Pages deployment is enabled.

## Preview on your computer

Download the repository ZIP, extract it, then open `preview/index.html` in Microsoft Edge. Keep the files together so **Find your car** opens `cars.html`.

- `preview/index.html`: main page and consignment enquiry form, including Contact Number.
- `preview/cars.html`: searchable car collection.
- `preview/admin-login.html`: entry to the admin demonstration.
- `preview/admin.html`: photo upload and listing-management demonstration. It has no real authentication.

Example inventory is labeled. Uploaded photos and listings stay in the same browser; they are not shared across devices. Enquiries are downloaded as text rather than sent to a dealer. External sample photos require an internet connection.

## Source structure

- `dist/`: public HTML source.
- `private/`: templates for the protected hosted admin page and car collection.
- `worker/`: server-side route and admin authorization implementation for Sites hosting.
- `scripts/`: build and authorization checks.

`private/` is a source directory name, not a security boundary on a static web server. The hosted Worker checks Sites-provided identity headers and the `ADMIN_EMAIL` runtime setting. It must run behind Sites authentication. Do not expose the admin template as a public static page for production.

## Build the hosted Worker locally

Requires Node.js 22 or later. No dependencies are needed.

Create `.openai/hosting.json` containing your Sites project identity. That local hosting file and all secrets are excluded from this repository.

```sh
node scripts/build-worker.mjs
node scripts/check-access.mjs
```

Set `ADMIN_EMAIL` through Sites runtime configuration, never in browser code. Publishing and domain setup remain separate from storing this source on GitHub.
