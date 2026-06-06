---
title: Pin Release Timing
tags:
  - workflow/task/issue
  - ux/responsiveness
  - design/motion/gsap
  - design/motion
severity: high
status: active
system: case-cards
viewport: 1024x768
---

# ISSUE-001 — Pin Release Timing

## Problem

Pinned image releases before metadata section completes.

## Affected Viewports

- [[05 XL]]
- [[01 XS]]

## Affected Systems

- [[case-cards]]
- [[motion-scroll]]

## Reproduction

1. Open homepage
2. Scroll to case cards
3. Observe pin release timing

## Suspected Cause

Viewport-height assumptions tied to `vh`.

## Related Constraints

- [[viewport-height]]

## Status

Active
