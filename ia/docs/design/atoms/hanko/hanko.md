---
title: Hanko
description: The brand mark, an inlined SVG in a span whose colour and size come from the caller's classes.
type: reference
component: atoms/hanko/hanko.njk
specimens:
  - title: Default
    note: Sample artwork stands in for the brand SVG that the site inlines from Sanity.
    params:
      svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 8h8v8H8z" fill="#000"/></svg>
  - title: Sized and coloured
    params:
      classes: inline-block w-24 text-primary-400
      svg: <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><path d="M8 8h8v8H8z" fill="#000"/></svg>
inContext:
  - { url: /, label: Global header }
---
