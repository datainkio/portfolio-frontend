BUG: Landing page can crash when console is open.
BUG: Lumberjack is inconsistent when respecting enabled/disabled state. It appears to propagate across scoped instances.
BUG: Gel disappears on scroll

TODO: Reduce heap size to <80MB. Current state is 180MB+.
Look for:

- large in-memory datasets (JSON payloads kept around),
- heavy client-side state (SPA routing + caches),
- rich editors / canvases,
- lots of 3rd-party scripts (analytics, A/B testing, chat, etc.),
- or a memory leak.

TODO: Add in-page jumplinks to header
TODO: Add site nav to header
