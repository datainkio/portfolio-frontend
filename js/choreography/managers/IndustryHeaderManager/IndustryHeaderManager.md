---
id: frontend.js.choreography.managers.industryheadermanager
role: "Runtime manager — keeps each industry section h3 sticky-top value in sync with the work header's expanded/collapsed state. When WorkHeaderManager collapses the jumplinks, IndustryHeaderManager slides all industry headings up to match the new header height; when it expands, they return to their natural position."
status: stable
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#js"
  - "#choreography"
  - "#manager"
  - "#IndustryHeaderManager"
links:
  - "[[system/gsap|system/gsap]]"
  - "[[config/ix/motion/motion|config/ix/motion]]"
  - "[[config/contracts/selectors/selectors|config/contracts/selectors]]"
  - "[[managers/WorkHeaderManager/WorkHeaderManager|WorkHeaderManager]]"
  - "[[organisms/section/work|work.njk]]"
  - "[[molecules/section/industry-section|industry-section.njk]]"
backlinks:
  - "[[AnimationDirector|AnimationDirector.js]]"
---
