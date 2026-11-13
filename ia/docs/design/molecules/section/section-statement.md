---
title: Section statement
description: One full-viewport mission statement, a heading and body over a portrait image. Layout sets which side the text sits on.
type: reference
component: molecules/section/section-statement.njk
specimens:
  - title: Left
    note: Live copy from the home singleton's first statement. Text in the left columns, figure flush right.
    params:
      layout: left
    bind:
      statement: cms.home.0.statements.0
    frame: p-0 h-[32rem] overflow-y-auto
  - title: Right
    note: The mirror. Text in the right columns, figure flush left and turned the other way.
    params:
      layout: right
    bind:
      statement: cms.home.0.statements.1
    frame: p-0 h-[32rem] overflow-y-auto
inContext:
  - { url: /, label: Homepage hero statements }
---

The hero alternates the layouts, `left` on odd statements and `right` on even
ones. The statement section is `h-dvh`, so each specimen scrolls inside its frame.
