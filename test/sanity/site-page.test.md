---
description: Sidecar for site-page.test.js. Unit test for the sitePage transform.
type: script
---

# Site page test

Run with `npm run test:sanity` (also part of `npm test`). No build needed.

Checks `resolveSitePageUrl` for the three contract URLs (`/docs/frontend/`, `/docs/frontend/tokens/`,
`/colophon/`), a cycle, a missing parent and a missing slug, and `normalizeSitePageRecords` for the
reserved `design` slug, `navParent` and `trail`.
