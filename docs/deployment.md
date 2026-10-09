---
description: "How staging and production deploy — branches, target repos, secrets, and the Sanity CORS requirement."
type: guide
---

# Deployment

Both environments are GitHub Pages sites built from this repo (`datainkio/portfolio-frontend`) by GitHub Actions. Each run installs with `npm ci`, runs `npm test`, then builds with `npm run quick`; a failing test stops the deploy.

| Env | Trigger | Workflow | Serves from | Domain |
| --- | --- | --- | --- | --- |
| Staging | push to `staging` | [deploy-staging.yml](../.github/workflows/deploy-staging.yml) | this repo's Pages (Actions artifact) | `staging.dataink.io` |
| Production | push to `main` | [deploy-production.yml](../.github/workflows/deploy-production.yml) | `datainkio/dataink.io@main` | `dataink.io` |

Both workflows also run on demand: `gh workflow run <workflow>.yml -R datainkio/portfolio-frontend --ref <branch>`.

## Why production pushes to another repo

GitHub Pages allows one custom domain per repo. This repo's slot holds `staging.dataink.io`; `datainkio/dataink.io` holds `dataink.io`. So the production workflow builds `_site/` here and pushes it to `datainkio/dataink.io@main` (`peaceiris/actions-gh-pages`), whose Pages serves that branch.

- Each deploy **replaces** the target branch contents (`keep_files: false`); commit message is `deploy: <source sha>`.
- `cname: dataink.io` rewrites `CNAME` on every deploy — don't remove it.
- Never commit to `datainkio/dataink.io` by hand; the next deploy overwrites it.
- Renaming repos to avoid the cross-repo push was considered and rejected: it would force the staging domain to move.

## Secrets (repo: `portfolio-frontend`)

| Secret | Used by | Purpose |
| --- | --- | --- |
| `SANITY_PROJECT_ID`, `SANITY_DATASET`, `SANITY_READ_TOKEN` | both | Build-time content fetch |
| `SANITY_WRITE_TOKEN` | both | Contact form (injected at build) |
| `DATAINK_IO_DEPLOY_KEY` | production | SSH private key; its public half is the write-enabled deploy key "dataink.io deploy" on `datainkio/dataink.io` |

A missing `DATAINK_IO_DEPLOY_KEY` fails the publish step with `not found deploy key or tokens`.

## Sanity CORS

Assets fetched in CORS mode — notably CSS `mask: url(...)` on the work-page video figure — are served by `cdn.sanity.io/files/…` only to origins in project `ofshczbc`'s CORS list. An unlisted origin gets a 403, the mask fails, and the masked element disappears.

Required origins (credentials off): `https://dataink.io`, `https://staging.dataink.io`, `http://localhost:8080`. Add any new domain before deploying to it:

```bash
npx sanity cors add https://<origin> --no-credentials   # from backend/
```

Check an origin: `curl -sI -H "Origin: https://<origin>" <asset-url> | grep -i access-control-allow-origin`.
