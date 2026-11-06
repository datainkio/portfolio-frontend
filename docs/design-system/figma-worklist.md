---
title: "Figma token worklist"
description: "Generated list of the paint styles and Tokens page layers to create in Figma so the sync reproduces what the site renders today. Regenerate with npm run seed:tokens; never edit by hand."
type: reference
status: active
tags:
  - design-system
  - design-tokens
  - figma
  - generated
links:
  - "[Decision](adr-0001-figma-owns-design-tokens.md)"
  - "[TokenService](../../figma/services/TokenService.md)"
---

# Figma token worklist

Create everything below in Figma, then set `FIGMA_TOKEN` and `FIGMA_FILE_ID` in `.env` and run `npm run build:design`. Review the first sync with `git diff styles/` before committing. If the values below match, the tokens resolve as they do today, and slate changes only from oklch to the nearest hex. The sync also rewrites the other colours and fonts from the live file, and they haven't been compared with Figma since October 2025, so any difference there is drift to look at.

Figma's REST API can't create styles or layers, so this is manual work.

## 1. Slate paint styles

Create each as a paint style named exactly as shown. The hex values are Tailwind's default slate converted from oklch.

| Style       | Hex       |
| ----------- | --------- |
| `slate/50`  | `#f8fafc` |
| `slate/100` | `#f1f5f9` |
| `slate/200` | `#e2e8f0` |
| `slate/300` | `#cad5e2` |
| `slate/400` | `#90a1b9` |
| `slate/500` | `#62748e` |
| `slate/600` | `#45556c` |
| `slate/700` | `#314158` |
| `slate/800` | `#1d293d` |
| `slate/900` | `#0f172b` |
| `slate/950` | `#020618` |

## 2. A page named `Tokens`

Each layer below is one token. The name must match exactly, and other layers on the page are ignored, so you can add labels.

### Spacing: rectangles, width sets the value

| Layer         | Width |
| ------------- | ----- |
| `spacing/0.5` | 2px   |
| `spacing/1`   | 4px   |
| `spacing/1.5` | 6px   |
| `spacing/2`   | 8px   |
| `spacing/3`   | 12px  |
| `spacing/4`   | 16px  |
| `spacing/5`   | 20px  |
| `spacing/6`   | 24px  |
| `spacing/8`   | 32px  |
| `spacing/10`  | 40px  |
| `spacing/12`  | 48px  |
| `spacing/14`  | 56px  |
| `spacing/16`  | 64px  |
| `spacing/18`  | 72px  |
| `spacing/20`  | 80px  |
| `spacing/24`  | 96px  |
| `spacing/32`  | 128px |
| `spacing/40`  | 160px |
| `spacing/48`  | 192px |
| `spacing/56`  | 224px |
| `spacing/64`  | 256px |

### Containers: rectangles, width sets the value

| Layer           | Width  |
| --------------- | ------ |
| `container/3xl` | 768px  |
| `container/6xl` | 1152px |
| `container/md`  | 448px  |
| `container/xl`  | 576px  |

### Radius: rectangles, corner radius sets the value

| Layer            | Corner radius |
| ---------------- | ------------- |
| `radius/DEFAULT` | 4px           |
| `radius/lg`      | 8px           |
| `radius/xl`      | 12px          |

### Shadow: rectangles, drop shadow effects set the value

Values read as x, y, blur, spread, colour. A comma means a second effect on the same layer.

| Layer         | Effects                                                               |
| ------------- | --------------------------------------------------------------------- |
| `shadow/sm`   | `0 0 4px 0 rgb(0 0 0 / 0.5)`                                          |
| `shadow/lg`   | `0 0 12px 0 rgb(0 0 0 / 0.5)`                                         |
| `shadow/md`   | `0 0 8px 0 rgb(0 0 0 / 0.5)`                                          |
| `shadow/xl`   | `0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)` |
| `shadow/b-lg` | `0 10px 12px -3px rgb(0 0 0 / 0.1)`                                   |
| `shadow/b-md` | `0 4px 8px -1px rgb(0 0 0 / 0.1)`                                     |
| `shadow/b-sm` | `0 1px 4px 0 rgb(0 0 0 / 0.05)`                                       |
| `shadow/l-lg` | `-10px 0 12px -3px rgb(0 0 0 / 0.1)`                                  |
| `shadow/l-md` | `-4px 0 8px -1px rgb(0 0 0 / 0.1)`                                    |
| `shadow/l-sm` | `-1px 0 4px 0 rgb(0 0 0 / 0.05)`                                      |
| `shadow/r-lg` | `10px 0 12px -3px rgb(0 0 0 / 0.1)`                                   |
| `shadow/r-md` | `4px 0 8px -1px rgb(0 0 0 / 0.1)`                                     |
| `shadow/r-sm` | `1px 0 4px 0 rgb(0 0 0 / 0.05)`                                       |
| `shadow/t-lg` | `0 -10px 12px -3px rgb(0 0 0 / 0.1)`                                  |
| `shadow/t-md` | `0 -4px 8px -1px rgb(0 0 0 / 0.5)`                                    |
| `shadow/t-sm` | `0 -1px 4px 0 rgb(0 0 0 / 0.05)`                                      |

### Type size: text layers, font size and line height set the value

| Layer       | Font size | Line height |
| ----------- | --------- | ----------- |
| `text/sm`   | 14px      | 20px        |
| `text/xs`   | 12px      | 16px        |
| `text/5xl`  | 48px      | 48px        |
| `text/xl`   | 20px      | 28px        |
| `text/6xl`  | 60px      | 60px        |
| `text/2xl`  | 24px      | 32px        |
| `text/4xl`  | 36px      | 40px        |
| `text/lg`   | 18px      | 28px        |
| `text/7xl`  | 72px      | 72px        |
| `text/base` | 16px      | 24px        |
| `text/3xl`  | 30px      | 36px        |
| `text/8xl`  | 96px      | 96px        |

### Font weight: text layers, font weight sets the value

| Layer                   | Weight |
| ----------------------- | ------ |
| `font-weight/light`     | 300    |
| `font-weight/medium`    | 500    |
| `font-weight/black`     | 900    |
| `font-weight/semibold`  | 600    |
| `font-weight/thin`      | 100    |
| `font-weight/bold`      | 700    |
| `font-weight/extrabold` | 800    |

### Line height: text layers at 100px, line height sets the ratio

| Layer             | Line height at 100px |
| ----------------- | -------------------- |
| `leading/tight`   | 125px                |
| `leading/normal`  | 150px                |
| `leading/relaxed` | 162.5px              |

### Letter spacing: text layers at 100px, letter spacing sets the value

| Layer             | Letter spacing at 100px |
| ----------------- | ----------------------- |
| `tracking/tight`  | -2.5px                  |
| `tracking/wide`   | 2.5px                   |
| `tracking/widest` | 10px                    |
| `tracking/wider`  | 5px                     |
