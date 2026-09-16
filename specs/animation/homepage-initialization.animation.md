---
title: "Home page initialization sequence"
description: "Present a view layer communicating load progress"
type: spec
---

The role of the homepage initialization sequence is to deliver a seamless, cinematic transition from empty page to a fully populated, animated, design home page.

## The elements

## The default sequence

The steps below describe the states and events from the user's perspective:
00: The user lands on the page. No HTML elements are visible other than the background color of the body element. The page load begins.

01: The preloader view enters.
02: The preloader view rests in its idle state as the page load continues.
03: The system waits for webfonts and for the choreography system to announce it is ready (`director:ready`). Both waits are bounded by timeouts. The background video's download starts here so it warms during the outro; it is not a gate.
04: The preloader view exits.

05: The background video enters.
06: The background video begins playback. Playback continues for the rest of the experience.
07: The gel enters.

08: The accession label enters.
09: The H1 element enters.
10: The mission statement enters.
11: The global header enters.
12: Initialization complete.

Note: For users returning to the homepage or who prefer reduced motion, the sequence skips to its completed state.
