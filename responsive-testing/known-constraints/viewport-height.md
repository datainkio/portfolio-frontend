---
title: Viewport Height Constraints
tags:
  - constraints
  - viewport
  - safari
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
