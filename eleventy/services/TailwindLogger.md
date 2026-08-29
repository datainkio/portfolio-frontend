---
description: Build-transparency service that instruments the Tailwind CSS v4 build with metrics and diagnostics.
status: stable
tags:
  - services
aliases:
  - TailwindLogger
links:
  - "[[README.services]]"
  - "[[buildCSS]]"
---

# TailwindLogger

Instruments the Tailwind CSS 4.0 build with the same transparency standards as the 11ty
and Figma pipelines: timing, file-size analysis, custom-property auditing, and actionable
diagnostics.

> [!danger] Do not remove the logging
> This service is essential for debugging CSS generation and build performance. It is
> imported **before** the Tailwind CLI runs and is driven by [[buildCSS]].

## Depends on

- `Lumberjack` for consistent terminal styling.
- Runs ahead of the Tailwind CLI; coordinates with existing build logging.

## Source

- Path: `eleventy/services/TailwindLogger.js`
