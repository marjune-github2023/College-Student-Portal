# Base44 Development Environment

## Project Overview
Northfield College Campus Portal — a pnpm monorepo for a student/registrar portal.

- **Frontend**: `artifacts/campus-portal` — Vite + React 19 + wouter + Tailwind v4. Served on host port 3000 (internal 5173). Dashboard content is still sample data from `src/data.ts`; authentication is real (see below).
- **API**: `artifacts/api-server` — Express 5, bundled with esbuild. Host port 8000 (internal 5000). Exposes `/api/healthz`, `/api/auth/*` and `/api/admin/users*`.
- **DB**: `lib/db` — Drizzle ORM + PostgreSQL. `users` and `sessions` tables in `src/schema/auth.ts`; password/session crypto in `password.mjs`.
- **API client**: `lib/api-client-react` — Orval-generated React Query hooks. Not imported by the frontend (the portal uses `src/lib/api.ts`).

## Running
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Web preview: http://localhost:3000
- API health: http://localhost:8000/api/healthz
- One-shot services: `db-push` (drizzle schema) then `seed-users` (dev accounts) run before `api-server` starts.

## Authentication model
- **Accounts**: one row per person in `users` (email unique, exactly one `role`, scrypt-hashed password via `lib/db/password.mjs`). Roles are listed in `artifacts/api-server/src/lib/roles.ts` and mirrored in `artifacts/campus-portal/src/lib/roles.ts`.
- **Sessions**: `POST /api/auth/login` sets `campus_session` — httpOnly, SameSite=Lax, `Secure` when the request is HTTPS or `NODE_ENV=production`. Only the SHA-256 of the token is stored in `sessions`; expiry is `SESSION_TTL_HOURS` (default 8h).
- **Access control**: `Protected` gates each frontend route by role, and the API repeats the check server-side (`requireAuth`/`requireRole`). A signed-in user hitting another role's dashboard gets an access-denied state, not the dashboard.
- **Role → dashboard** lives in `src/lib/roles.ts` (`ROLE_HOME`); `/` redirects to the signed-in user's dashboard.
- **Provisioning**: System Administrators and Super Administrators use `/admin/accounts` to create accounts (name, email, role, temporary password), change roles, disable accounts, and reset passwords. Guards: nobody can change their own role/status, only a Super Administrator can grant or manage Super Administrator accounts, and a password reset or disable revokes that user's sessions.
- **Recovery**: no self-service reset. The Registrar, a System Administrator or a Super Administrator issues a new temporary password from `/admin/accounts`.
- **CSRF**: cookie-authenticated mutations require the `X-Requested-With: XMLHttpRequest` header (sent by `src/lib/api.ts`), which cross-site requests cannot add without a preflight that the API's CORS allowlist refuses. Do not relax CORS to `*` with credentials.
- **Demo accounts**: `.env.base44-defaults` sets `SEED_DEMO_USERS=1` and a shared `DEMO_USER_PASSWORD`, and `lib/db/seed.mjs` creates one local account per role (`student@northfield.edu`, `sysadmin@northfield.edu`, …). **Production must not set `SEED_DEMO_USERS`**, and the seed never overwrites an existing password.

## Environment / sandbox notes
- The browser talks to the API same-origin: Vite proxies `/api` to `API_PROXY_TARGET` (`http://api-server:5000`) with `xfwd`, so the session cookie is first-party and `req.ip`/`req.secure` stay meaningful. `changeOrigin` is deliberately `false`.
- Behind the preview proxy the page `Origin` host and the `Host` header the API receives differ; the CSRF check therefore relies on the custom header plus SameSite/CORS rather than comparing those hosts.
- Production wiring: set `NODE_ENV=production` (Secure cookies) and, only if a separate frontend origin is used, `APP_ORIGINS` (comma-separated) for CORS.

## Key Details
- Node 24, pnpm 10 (installed in `Dockerfile.base44`).
- `pnpm install --frozen-lockfile` runs in a dedicated `install-deps` one-shot service; the other services depend on it completing successfully (avoids concurrent installers on shared node_modules).
- Frontend env (required by `vite.config.ts`): `PORT=5173`, `BASE_PATH=/`, `API_PROXY_TARGET`.
- API env: `PORT=5000`, `DATABASE_URL` (local Postgres in compose, not an external secret), plus `SESSION_TTL_HOURS` from `.env.base44-defaults`.
- Vite plugins `@replit/vite-plugin-cartographer` and `dev-banner` load only when `REPL_ID` is set — not set in Docker, so they are skipped.
- `pnpm-workspace.yaml` has `minimumReleaseAge: 1440` (supply-chain defense). With `--frozen-lockfile` this does not cause issues.

## Gotchas
- Root `package.json` has a `preinstall` script that rejects non-pnpm package managers.
- `vite.config.ts` throws if `PORT` or `BASE_PATH` are missing.
- `server.fs.strict: true` in the campus-portal vite config — if the frontend starts importing workspace packages from `lib/`, you may need to add them to vite's `server.fs.allow`.
- The API server `dev` script builds with esbuild then starts (`build && start`) — no live reload. Restart the service after API code changes.
- `lib/db` is a TypeScript project referenced by `api-server`; run `pnpm run typecheck:libs` before `pnpm --filter @workspace/api-server run typecheck`, otherwise tsc complains that `lib/db/dist` is missing.
- Schema changes: `pnpm --filter @workspace/db run push-force` (the `db-push` compose service does this on boot).

## Verification
- Auth smoke test: `curl -i -X POST http://localhost:3000/api/auth/login -H 'Content-Type: application/json' -H 'X-Requested-With: XMLHttpRequest' -d '{"email":"student@northfield.edu","password":"<DEMO_USER_PASSWORD>"}'` should return the student user and set `campus_session`.
- Role gate: with a student cookie, `GET /api/admin/users` returns 403.
- `docker compose -f docker-compose.base44.yml exec -T web sh -ec 'pnpm run typecheck'` must pass.
