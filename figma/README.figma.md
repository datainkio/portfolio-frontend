---
title: Figma token sync
description: "Pulls published color and text styles from the Figma file and writes them as Tailwind v4 theme tokens."
type: index
---

# Figma token sync

The Figma file is the source of truth for color and type. `npm run build:design` reads its published styles and writes them as Tailwind v4 `@theme` variables, so each token becomes a utility class (`--color-accent-500` → `text-accent-500`, `--font-display` → `font-display`).

## Run it

```bash
npm run build:design   # sync only, then rebuilds CSS
npm run build          # full build, sync included
```

- Needs `FIGMA_TOKEN` and `FIGMA_FILE_ID` in `.env` (see `.env.example`).
- `npm run quick` and both deploy workflows skip the sync. They build from the CSS files already committed.
- On any failure the script exits 1. A bad token or file ID stops the build rather than leaving stale tokens behind silently.

## What it writes

| File                                 | Contents                                     | From                                  |
| ------------------------------------ | -------------------------------------------- | ------------------------------------- |
| `styles/colors.css`                  | `--color-<family>-<variant>: #hex`           | Color styles                          |
| `styles/typography/fontFamilies.css` | `--font-<name>: <family>`                    | Text styles named `fontFamily/<name>` |
| `styles/typography/imports.css`      | Google Fonts `@import` per family and weight | All text styles                       |

`styles/main.css` imports all three. Don't hand-edit them, because the next sync overwrites them.

## Naming in Figma

- **Colors**: `family/variant`, such as `accent/500`. With a third segment, such as `brand/accent/500`, every segment joins into the name: `--color-brand-accent-500`.
- **Font families**: `fontFamily/<name>`, such as `fontFamily/display`. `sans-serif` becomes `sans`.
- **Styles the sync can't read**: effect and grid styles make it throw `Unknown style type`. Frame styles are skipped.

## What it writes vs. what it reads

The sync reads more than it writes. Everything below is fetched on every run.

| Figma property                                        | Written?                                                                                   | Could feed                             |
| ----------------------------------------------------- | ------------------------------------------------------------------------------------------ | -------------------------------------- |
| Color fill (r, g, b)                                  | Yes                                                                                        | `--color-*`                            |
| Color alpha                                           | No, so every color comes out opaque                                                        | `--color-*` as `#rrggbbaa`             |
| `fontFamily`                                          | Yes                                                                                        | `--font-*`                             |
| `fontWeight`                                          | Only into font imports. The writer exists but is commented out in `scripts/fetchFigma.js`. | `--font-weight-*`                      |
| `fontSize`                                            | No. The writer is an empty file.                                                           | `--text-*`                             |
| `lineHeightPx`, `lineHeightPercent`, `lineHeightUnit` | No. The writer is an empty file.                                                           | `--leading-*`, `--text-*--line-height` |
| `letterSpacing`                                       | No                                                                                         | `--tracking-*`                         |
| `textAlignHorizontal`, `textAlignVertical`            | No                                                                                         | —                                      |
| Image fills (patterns)                                | No. They're parsed, then dropped.                                                          | —                                      |
| Effect styles (shadows, blurs)                        | Not readable. They throw.                                                                  | `--shadow-*`, `--blur-*`               |

Type scale, weights, leading and tracking therefore come from Tailwind's defaults or hand-written CSS. So does the `slate` palette, which is Tailwind's built-in palette, not a Figma token. Spacing, radius and other numeric tokens would need Figma Variables, which this sync doesn't read.

## Before the next sync

The last sync ran on 2025-10-14. Since then, two generated files have been edited by hand:

- `imports.css` self-hosts IBM Plex Sans and loads Cormorant Garamond from `fonts.njk`. That work is from the 2026-09-21 load-strategy change. A sync would replace it with Google Fonts `@import`s.
- `fontFamilies.css` has quoted names and system fallback stacks. The generator writes `--font-<name>: <Family>, <name>`, which has no quotes and no real fallback.

Before syncing, either port those changes into `figma/views/tailwind/FontImportsFile.js` and `FontFamilyFile.js`, or diff and restore the files afterwards.

## Code map

- `api/`: `FigmaClient`, which handles auth and env, plus the endpoint paths.
- `services/`: `FileService` fetches the file, `StyleService` sorts styles into colors, text formats and patterns, and `PaletteService` and `TypographyService` call the writers.
- `models/`: `Color`, `TextFormat`, `Pattern` and `DesignFile`. These define which Figma fields get read.
- `utils/styleFactory.js`: maps a Figma style node to a model.
- `views/tailwind/`: one writer per output file. `FontSizeFile.js` and `LineHeightFile.js` are empty placeholders.
- `scripts/fetchFigma.js`: the orchestrator. `scripts/buildReadmeAssets.js` counts these tokens for the README badge.
