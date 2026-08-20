---
id: frontend.js.choreography.organisms.index
role: "Organisms barrel — re-exports all section controllers, animation modules, trigger modules, and organism utilities."
status: stable
surface: internal
scope: frontend
runtime: browser
atomicLevel: "organism"
tags:
  - choreography
  - frontend
  - index
  - js
links:
  - "[[Hero|Hero]]"
  - "[[HeroAnimations|HeroAnimations]]"
  - "[[HeroTriggers|HeroTriggers]]"
  - "[[Bio|Bio]]"
  - "[[BioAnimations|BioAnimations]]"
  - "[[BioTriggers|BioTriggers]]"
  - "[[Work|Work]]"
  - "[[WorkAnimations|WorkAnimations]]"
  - "[[WorkTriggers|WorkTriggers]]"
  - "[[Awards|Awards]]"
  - "[[AwardsAnimations|AwardsAnimations]]"
  - "[[AwardsTriggers|AwardsTriggers]]"
  - "[[Organizations|Organizations]]"
  - "[[OrganizationsAnimations|OrganizationsAnimations]]"
  - "[[OrganizationsTriggers|OrganizationsTriggers]]"
  - "[[BackgroundVideo|BackgroundVideo]]"
  - "[[BackgroundVideoAnimations|BackgroundVideoAnimations]]"
  - "[[BackgroundVideoTriggers|BackgroundVideoTriggers]]"
  - "[[Card|Card]]"
  - "[[CardManager|CardManager]]"
  - "[[ProjectHeader|ProjectHeader]]"
  - "[[RulerIntro|RulerIntro]]"
  - "[[Line|Line]]"
---

## Animation responsiveness

On a resize that crosses a breakpoint, matchMedia reverts+kills that context, stripping the revealed inline styles, and the reveal only fires once (off the header intro) so it never re-applies.
