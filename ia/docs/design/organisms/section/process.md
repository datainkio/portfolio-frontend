---
title: Process section
description: A heading and two paragraphs of process copy, with optional decorative scenes that motion fills in.
type: reference
component: organisms/section/process.njk
specimens:
  - title: Copy only
    note: No page renders this section today. The section is a full viewport tall, and the blockframes grid stays empty without its script.
    params:
      id: specimen-process
      copy:
        heading: Process
    frame: p-0 h-[32rem] overflow-y-auto
  - title: With UI components scene
    note: "uiComponents adds the looping scene's static artwork. It animates only when the matching process variant is active."
    params:
      id: specimen-process-scene
      uiComponents: true
      copy:
        heading: Process
    frame: p-0 h-[32rem] overflow-y-auto
---
