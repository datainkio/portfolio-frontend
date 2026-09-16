---
description: "Runtime manager — manages session state persistence in sessionStorage, tracking per-visit preloader status (hasVisited/markVisited), per-section entrance-animation played status (hasPlayed/markPlayed), and user interaction history. Exports SESSION_GATING_ENABLED (currently false): when off, has*() always return false and mark*() are no-ops, so the splash and every section intro replay on each visit. Exposes a getSessionManager() singleton factory; ad hoc lifecycle, not Director-constructed."
status: stable
tags:
  - choreography
  - manager
---
# SessionManager.js
Manages session state persistence in sessionStorage, tracking per-visit preloader status (hasVisited/markVisited), per-section entrance-animation played status (hasPlayed/markPlayed), and user interaction history.