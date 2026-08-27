---
id: frontend.js.choreography.managers.sessionmanager
role: "Runtime manager — manages session state persistence in sessionStorage, tracking per-visit preloader status (hasVisited/markVisited), per-section entrance-animation played status (hasPlayed/markPlayed), and user interaction history. Exposes a getSessionManager() singleton factory; ad hoc lifecycle, not Director-constructed."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - choreography
  - frontend
  - js
  - manager
links: []
backlinks:
  - "[[system/AbstractSection|system/AbstractSection]]"
  - "[[../../../preloader/Preloader|preloader/Preloader]]"
---
