---
description: "Self-hosted web fonts: DraftPaper (display) and IBM Plex Sans latin 300/300i (body), both declared in styles/typography/imports.css."
type: index
---

Self-hosted web fonts, declared as `@font-face` in `styles/typography/imports.css`:

- `DRAFTPAPER/` — display face (`--font-display`); the hero LCP text. Preloaded from `fonts.njk`.
- `IBMPlexSans/` — body face (`--font-body`); latin subset, weight 300 normal + italic, from Google Fonts (OFL). Replaced the render-blocking `fonts.googleapis.com` stylesheet.
