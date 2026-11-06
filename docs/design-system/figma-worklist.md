---
title: "Figma token worklist"
description: "Generated list of the paint styles, text style changes, and Tokens page layers to make in Figma so the sync reproduces what the site renders today. Regenerate with npm run seed:tokens; never edit by hand."
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

Make everything below in Figma, then run `npm run build:design` and review `git diff styles/` before committing. If the values match, the tokens resolve as they do today, and slate changes only from oklch to the nearest hex. Until the layers in section 3 exist, the sync leaves `styles/tokens.css` alone.

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

## 2. Existing text styles

The sync reads the type scale from these styles, so there's nothing to duplicate. Figma's values differ from what the site renders in the ways below.

### `fontSize/*`: set an explicit line height, and add `5xl` to `8xl`

The existing styles use auto line height, which the sync rejects because auto is a metric of the font.

| Style           | Font size | Line height |
| --------------- | --------- | ----------- |
| `fontSize/sm`   | 14px      | 20px        |
| `fontSize/xs`   | 12px      | 16px        |
| `fontSize/5xl`  | 48px      | 48px        |
| `fontSize/xl`   | 20px      | 28px        |
| `fontSize/6xl`  | 60px      | 60px        |
| `fontSize/2xl`  | 24px      | 32px        |
| `fontSize/4xl`  | 36px      | 40px        |
| `fontSize/lg`   | 18px      | 28px        |
| `fontSize/7xl`  | 72px      | 72px        |
| `fontSize/base` | 16px      | 24px        |
| `fontSize/3xl`  | 30px      | 36px        |
| `fontSize/8xl`  | 96px      | 96px        |

### `lineHeight/*`: set these values at the existing 12px font size

| Style                | Line height at 12px |
| -------------------- | ------------------- |
| `lineHeight/tight`   | 15px                |
| `lineHeight/normal`  | 18px                |
| `lineHeight/relaxed` | 19.5px              |

### `fontWeight/sans/*`: no change needed

The file's `thin` reads 250 and the site declares 100. Both resolve to the same font file, because no served face is lighter than 300, so leave it unless the fonts change.

## 3. New layers on the `#️ Tokens` page

Add these to the existing page. Each layer is one token, and the name must match exactly. Other layers on the page are ignored.

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

### Letter spacing: text layers at 100px, letter spacing sets the value

| Layer             | Letter spacing at 100px |
| ----------------- | ----------------------- |
| `tracking/tight`  | -2.5px                  |
| `tracking/wide`   | 2.5px                   |
| `tracking/widest` | 10px                    |
| `tracking/wider`  | 5px                     |
