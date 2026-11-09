---
description: Sidecar for pager.test.js. Checks the built case-study pager.
type: script
---

# Pager Test

Checks the built site, so run `npm run quick` first, then `npm run test:site`.

For every `/case-studies/<slug>/` page:

- Exactly one `<nav aria-label="Case studies">`.
- The previous, all, and next links resolve to built pages.
- Previous and next are reciprocal: if A's next is B, then B's previous is A.
- Following `next` visits every project once and returns to the start (wrap).
