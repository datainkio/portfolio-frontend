---
title: Viewport Height Constraints
description: "Known constraint: short and dynamically-resizing viewport heights compress pinned regions; records problems and mitigations."
type: reference
tags:
  - constraints
  - safari
  - viewport
---

# Viewport Height Constraints

## Known Problems

- short laptop heights compress pinned regions
- Safari address bar changes viewport height dynamically
- fullscreen sections can become claustrophobic

## Mitigations

- prefer dvh/svh over vh where appropriate
- reduce pin durations on constrained heights
- simplify metadata on shorter screens
