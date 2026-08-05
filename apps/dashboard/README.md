# iuvui Pro Dashboard

The authenticated application for `app.iuvui.com`.

## Local setup

1. Copy `.env.example` to `.env.local` and set the Clerk publishable key for the browser application.
2. Copy `.dev.vars.example` to `.dev.vars` and set the Clerk publishable and secret keys for the Worker API.
3. Configure `http://localhost:5173` as an allowed Clerk origin and redirect URL.
4. Start the app with `pnpm dashboard` from the repository root.

The interface renders a configuration screen when `VITE_CLERK_PUBLISHABLE_KEY` is absent. The protected `/api/session` endpoint returns `503` until the Worker Clerk variables are configured.

## Production

Store `CLERK_SECRET_KEY` as a Cloudflare secret. Do not commit `.env.local` or `.dev.vars`.

```bash
pnpm --filter @iuvui/dashboard exec wrangler secret put CLERK_SECRET_KEY
pnpm --filter @iuvui/dashboard deploy
```
