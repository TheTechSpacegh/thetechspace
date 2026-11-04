# Deploying the site

The site, the API and the database all run on [Render](https://render.com):

| Piece | Render service | Defined in |
|---|---|---|
| Public site + admin console | Static Site `tts-site` (global CDN) | `render.yaml` in this repo |
| API | Web Service `tts-api` (Frankfurt) | `render.yaml` in the backend repo |
| Database | Render Postgres `tts-db` (Frankfurt) | `render.yaml` in the backend repo |

## What happens on each push

| Event | GitHub Actions | Render |
|---|---|---|
| Pull request | **Lint & build** runs on the PR | nothing |
| Push to `main` | **Lint & build** runs | deploys **only if the check passed** (`autoDeployTrigger: checksPass`) |
| Push to other branches | **Lint & build** runs | nothing |

Dependabot opens one grouped dependency PR each week, and CI checks it like any other PR.

## One-time setup

Do the backend first, so you know the API's address.

1. **Backend:** follow *Deploying* in the backend repo's README. It creates the database and the API from one Blueprint.
2. **Site:** in Render, choose *New → Blueprint* and pick this repository.
   - When asked for `VITE_API_URL`, enter the API's public address, e.g. `https://api.thetechspace.com` or `https://tts-api.onrender.com`.
   - The value is built into the site, so after changing it, trigger a new deploy.
3. **Point the API at the site:** in the API's environment, set `FRONTEND_URL` to the site's address, e.g. `https://thetechspace.com` or `https://tts-site.onrender.com`.
4. **Custom domains (strongly recommended):** add `thetechspace.com` to `tts-site` and `api.thetechspace.com` to `tts-api` (*Settings → Custom Domains*), then update `VITE_API_URL` and `FRONTEND_URL` to match.
   - **Why:** browsers treat `tts-site.onrender.com` and `tts-api.onrender.com` as *unrelated* sites, because `onrender.com` is a public suffix. On those addresses, admin sign-in relies on cross-site cookies, which Safari and other browsers that block third-party cookies may refuse.
   - On a shared domain, sign-in uses ordinary same-site cookies and works everywhere.
   - The API detects which case applies automatically.
5. **Protect `main`:** under *Settings → Branches* on GitHub, require the **Lint & build** check before merging.

## What production gets

These are set in `render.yaml`:

- **Security headers:**
  - A Content Security Policy: scripts only from the site itself, images, video and API calls only over https, and the site can't be framed.
  - HSTS, `nosniff`, a strict referrer policy, and a Permissions-Policy that turns off the camera, microphone, location and payments.
  - The API must be served over https; the policy blocks plain-http API calls.
- **Routing:** every path falls back to `index.html` for React Router. Real files such as `/assets/…` and `/robots.txt` are served first.
- **Caching:** fingerprinted files in `/assets` are cached for a year.
- **Search engines:** `/admin` is blocked in `robots.txt` and sent with `X-Robots-Tag: noindex`.
- **Page titles and sharing:** every page has its own title, and the site has Open Graph tags for link previews.
- **Size:** content images are WebP, and only Home and About load up front; other pages load when visited.

## Running the same checks locally

```bash
npm ci
npm run lint
npm run build
```
