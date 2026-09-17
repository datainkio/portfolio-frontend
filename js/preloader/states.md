---
description: "State diagram of the home-page load: initial → loading → revealing → ready, with what is visible or hidden in each."
type: reference
tags:
  - preloader
  - choreography
links:
  - "[[Preloader.js]]"
  - "[[README.preloader.md]]"
---

```mermaid
stateDiagram-v2
    direction TB

    state "1. Initial" as initial
    initial : Visible — background
    initial : Hidden — header, preloader, footer

    state "2. Loading" as loading
    loading : Visible — background, preloader
    loading : Hidden — header, footer

    state "3. Revealing" as revealing
    revealing : Visible — background, preloader, header, footer
    revealing : Preloader is exiting
     
    state "4. Ready" as ready
    ready : Visible — background, header, footer
    ready : Hidden — preloader

    [*] --> initial
    initial --> loading : Start preloading
    loading --> revealing : Required assets ready
    revealing --> ready : Exit animation complete
```
