# Base44 Development Environment

## Project Overview
Northfield College Campus Portal — a pnpm monorepo for a student/registrar portal.

- **Frontend**: `artifacts/campus-portal` — Vite + React 19 + wouter + Tailwind v4. Served on host port 3000 (internal 5173). Uses static mock data from `src/data.ts`; does NOT call the API.
- **API**: `artifacts/api-server` — Express 5, bundled with esbuild. Currently only exposes `/api/healthz`. Host port 8000 (internal 5000).
- **DB**: `lib/db` — Drizzle ORM + PostgreSQL. Schema is currently empty (`export {}`).
- **API client**: `lib/api-client-react` — Orval-generated React Query hooks. Not yet imported by the frontend.

## Running
```bash
docker compose -f docker-compose.base44.yml up -d --build
```
- Web preview: http://localhost:3000
- API health: http://localhost:8000/api/healthz

## Key Details
- Node 24, pnpm 10 (installed in `Dockerfile.base44`).
- `pnpm install --frozen-lockfile` runs in a dedicated `install-deps` one-shot service; `web` and `api-server` depend on it completing successfully (avoids concurrent installers on shared node_modules).
- Frontend env (required by `vite.config.ts`): `PORT=5173`, `BASE_PATH=/`.
- API env: `PORT=5000`, `DATABASE_URL` (local Postgres in compose, not an external secret).
- Vite plugins `@replit/vite-plugin-cartographer` and `dev-banner` load only when `REPL_ID` is set — not set in Docker, so they are skipped.
- `pnpm-workspace.yaml` has `minimumReleaseAge: 1440` (supply-chain defense). With `--frozen-lockfile` this does not cause issues.

## Gotchas
- Root `package.json` has a `preinstall` script that rejects non-pnpm package managers.
- `vite.config.ts` throws if `PORT` or `BASE_PATH` are missing.
- `server.fs.strict: true` in the campus-portal vite config — if the frontend starts importing workspace packages from `lib/`, you may need to add them to vite's `server.fs.allow`.
- The API server `dev` script builds with esbuild then starts (`build && start`) — no live reload. Restart the service after API code changes.
