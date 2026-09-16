---
description: "Master choreography controller — initializes and coordinates AnimationBus, ScrollEffectsCoordinator, section controllers, CardManager, GlobalHeaderManager, HomeHeaderManager (bus-injected), WorkHeaderManager, ProjectHeaderManager, and LandingSequence."
status: stable
tags:
  - choreography
  - system
links:
  - "[[AnimationBus|AnimationBus]]"
  - "[[ScrollEffectsCoordinator|ScrollEffectsCoordinator]]"
  - "[[LandingSequence|LandingSequence]]"
  - "[[registry|registry]]"
  - "[[events|events]]"
  - "[[CardManager|CardManager]]"
  - "[[GlobalHeaderManager|GlobalHeaderManager]]"
  - "[[HomeHeaderManager|HomeHeaderManager]]"
  - "[[WorkHeaderManager|WorkHeaderManager]]"
  - "[[ProjectHeader|ProjectHeader]]"
---

# AnimationDirector.js

In its role as the master choreography controller, AnimationDirector is the second gate for the #preloader strategy; builds bus, stage, sections, managers, LandingSequence, then emits director:ready (or 8000ms timeout + console.warn).

1. The script self-initializes on load ^43ea41
2. Initialize AnimationBus ^853775
3. Initialize ScrollEffectsCoordinator ^72a792
4. Initialize managers ^b5aa46
5. Initialize LandingSequence ^f25455
6. Dispatch EVENTS.system.directorReady ^e44458
