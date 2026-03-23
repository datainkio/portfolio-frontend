# Choreography Config Package

```mermaid
flowchart TB
  subgraph CFG[frontend/js/choreography/config]
    IDX[index.js\nbarrel export]
    ACC[accessibility.js\nACCESSIBILITY_SETTINGS]
    ARR[arrangements.js\nSECTION_TO_GEL_ARRANGEMENT\nGEL_ARRANGEMENTS\nGEL_ARRANGEMENT_TRANSITION\nCOLOR_CLASSES]
    EVT[events.js\nEVENTS]
    MOT[motion.js\nmotionTokens\nmotion\nANIMATION_DEFAULTS]
    PTH[paths.js\nASSET_PATHS]
    SCR[scrolltriggers.js\nSCROLL_DEFAULTS\nHERO_TRIGGER\nBIO_TRIGGER]
    SEL[selectors.js\nSELECTORS]
  end

  IDX --> ACC
  IDX --> ARR
  IDX --> EVT
  IDX --> MOT
  IDX --> PTH
  IDX --> SCR
  IDX --> SEL

  subgraph EXT[External Consumers]
    BUS[AnimationBus / sections / managers]
    GSAP[vendor/gsap.js]
    ENTRY[config/index.js imports\n(used across choreography)]
  end

  BUS --> EVT
  BUS --> ARR
  BUS --> MOT
  BUS --> SEL
  GSAP --> MOT
  ENTRY --> IDX
```
