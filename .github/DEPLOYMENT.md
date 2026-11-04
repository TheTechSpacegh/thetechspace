# Deploying

The site, the API and the database run in one [Railway](https://railway.com) project, **TheTechSpace**:

| Piece | Railway service | Defined in |
|---|---|---|
| Public site + admin console | `tts-site` (Vite build served by Caddy) | `.railway/railway.ts` + `Caddyfile` in this repo |
| API | `tts-api` (Node) | `.railway/railway.ts` in the backend repo |
| Database | `tts-db` (PostgreSQL 18) | `.railway/railway.ts` in the backend repo |

All three run in EU West (Amsterdam), Railway's closest region to Ghana.

**Do you need to add a database?** Yes. The backend repo's `.railway/railway.ts` creates it for you (`tts-db`), and it connects the API to it automatically over Railway's private network. A new database starts empty; step 5 below loads your content.

## What happens on each push

| Event | GitHub Actions | Railway |
|---|---|---|
| Pull request | **Lint & build** runs on the PR | nothing |
| Push to `main` | **Lint & build** runs | deploys **only if the checks passed** (`checkSuites: true`) |
| Push to other branches | **Lint & build** runs | nothing |

## One-time setup

You need a Railway account on the **Hobby** plan or higher; the free trial pauses services.

1. **Install the latest Railway CLI and sign in.** The new config commands need CLI v5. The v4 you have installed is too old.
   ```bash
   npm i -g @railway/cli@latest
   railway login
   ```
2. **Create the project:** in the dashboard, choose *New Project → Empty Project* and name it **TheTechSpace**. In each repo, run `railway link` and pick that project.
3. **Add the shared variables:** under *Project → Settings → Shared Variables* (environment: production), add:

   | Name | Value |
   |---|---|
   | `JWT_SECRET` | 48+ random characters: `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`. Mark it **sealed**. |
   | `API_URL` | The API's public address, e.g. `https://api.thetechspace.com` (or the `*.up.railway.app` domain from step 4) |
   | `FRONTEND_URL` | The site's public address, e.g. `https://thetechspace.com` |

   Both services read these, so the site and the API always agree on each other's address. Secrets never go in git.
4. **Create the services:** apply the backend repo first (it creates `tts-db` and `tts-api`), then this one (`tts-site`):
   ```bash
   railway config plan     # preview: should only add services
   railway config apply
   ```
   Then give each service a public address: either *Settings → Networking → Generate Domain*, or a custom domain (step 6). Put those addresses into `API_URL` and `FRONTEND_URL`, and redeploy both services.
5. **Load the content and create your owner account** (from the backend repo):
   ```bash
   railway ssh --service tts-api   # opens a shell inside the running API
   SEED_OWNER_EMAIL=you@thetechspace.com SEED_OWNER_PASSWORD="…" npm run db:seed
   ```
   It runs inside Railway because the database is only reachable on its private network. It's safe to re-run. Then sign in at `<site>/admin`.
6. **Custom domains (strongly recommended):** add `thetechspace.com` to `tts-site` and `api.thetechspace.com` to `tts-api` (*Settings → Networking → Custom Domain*), point the DNS records Railway shows you at them, and update the two shared URLs.
   - **Why:** browsers treat `tts-site.up.railway.app` and `tts-api.up.railway.app` as *unrelated* sites, because `up.railway.app` is a public suffix. On those addresses, admin sign-in relies on cross-site cookies, which Safari and other browsers that block third-party cookies may refuse.
   - On a shared domain, sign-in uses ordinary same-site cookies and works everywhere.
   - The API detects which case applies automatically.
7. **Protect `main`:** under *Settings → Branches* on GitHub, require the **Lint & build** check before merging.

To change infrastructure later, edit `.railway/railway.ts` and run `railway config plan` / `apply` again. Railway doesn't read the file during deploys; it only takes effect when you apply it.

## What production gets

These are set in the `Caddyfile`:

- **Security headers:**
  - A Content Security Policy: scripts only from the site itself, images, video and API calls only over https, and the site can't be framed.
  - HSTS, `nosniff`, a strict referrer policy, and a Permissions-Policy that turns off the camera, microphone, location and payments.
  - The API must be served over https; the policy blocks plain-http API calls.
- **Routing:** every path falls back to `index.html` for React Router; real files are served first.
- **Caching and compression:** fingerprinted files in `/assets` are cached for a year, and responses are compressed (zstd/gzip).
- **Health check:** `/health` answers 200 for Railway's health check.
- **Search engines:** `/admin` is blocked in `robots.txt` and sent with `X-Robots-Tag: noindex`.

## Running the same checks locally

```bash
npm ci
npm run lint
npm run build
```
