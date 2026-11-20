Decision records for the design system and its token pipeline. Each ADR says what was decided, why, and what it changed. The [design system spec](../design-system.spec.md) states the rules that follow from them.

# Decisions

## What's here

- [adr-0001-figma-owns-design-tokens.md](adr-0001-figma-owns-design-tokens.md): accepted; who owns which tokens, and why
- [adr-0002-figma-library-variables-are-the-design-tokens.md](adr-0002-figma-library-variables-are-the-design-tokens.md): proposed; moves the token source from the old Figma file to the design-system library's variables
- [adr-0003-figma-owns-mapped-component-colours.md](adr-0003-figma-owns-mapped-component-colours.md): proposed; extends Figma ownership from tokens to a mapped component's colour utilities, starting with Button
- [adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md](adr-0004-gsap-runs-motion-eases-as-mapped-core-eases.md): accepted; GSAP runs each motion-token ease as the nearest GSAP core ease, through `GSAP_EASE`

## Token ownership

Where each token comes from, how it reaches the CSS, and what guards it.

```mermaid
flowchart TB
    subgraph SOURCES["Token sources (who owns what)"]
        FIG["Figma library<br/>variables · Shadow effect styles<br/>(read through its Tokens page)"]
        MOTJS["js/choreography/tokens/motion/motion.js"]
        HAND["styles/typography/<br/>font faces + families (by hand)"]
    end

    subgraph SYNC["Sync commands"]
        BD["npm run build:design<br/>(fetchFigma.js → VariablesService → PaletteService / TokenService)"]
        BM["npm run build:motion"]
    end

    subgraph GEN["Generated CSS — never hand-edit"]
        COL["styles/colors.css<br/>palette: primary · secondary · tertiary<br/>accent · neutral · semantic-*"]
        TOK["styles/tokens.css<br/>spacing · containers · radius · shadow<br/>tracking · type size/leading/weight"]
        MOT["styles/motion.css<br/>durations + easings"]
    end

    subgraph CSS["styles/main.css — import order is critical"]
        direction TB
        L1["1 fonts (typography/imports.css)"]
        L2["2 Tailwind v4 + typography plugin"]
        L3["3 base.css · sizes.css"]
        L4["4 theme layer:<br/>colors · fontFamilies · tokens · motion"]
        L5["5 decorations.css (halftone, stripes)<br/>utilities/ mask · text · reduced-motion"]
        L6["6 components/ hanko · portable-text"]
        L1 --> L2 --> L3 --> L4 --> L5 --> L6
    end

    subgraph COMP["Components — views/ (atomic design)"]
        direction TB
        ATOM["atoms/<br/>button · cta · heading · icon · gel<br/>pixelator · award · organization"]
        MOL["molecules/<br/>card · callout · list · stats · navigation<br/>figure · lightbox · project-metadata …"]
        ORG["organisms/<br/>section (hero · work · organizations · awards · process)<br/>header · footer · forms · navigation"]
        LAY["layouts/ + templates/ + pages/"]
        ATOM --> MOL --> ORG --> LAY
    end

    API["Component API contract<br/>one render(params = {}) macro<br/>classes + styles slots · no ambient context<br/>+ co-located .md sidecar (## Params)"]

    subgraph REF["Living reference — /docs/design/"]
        IA["ia/docs/design/<br/>atoms · molecules · organisms · layouts · templates · tokens"]
        DOC["templates/design-doc/design-doc.njk<br/>specimens · call code · params from sidecar"]
        RDR["eleventy/collections/designSystem.js<br/>eleventy/filters/design.js"]
        IA --> DOC
        RDR --> DOC
    end

    subgraph ENF["Enforcement — npm run validate"]
        E1["lint:palette<br/>no off-palette colours, no repeated arbitrary values"]
        E2["lint:frontmatter"]
        E3["audit:sidecars"]
        E4["check:motion<br/>motion.css == fresh build"]
        E5["test + quick<br/>broken imports fail the build<br/>motion-eases: every ease token maps to GSAP"]
    end

    GE["config/ix/motion.js GSAP_EASE<br/>nearest GSAP core ease per token (ADR 0004)"]

    SPEC["specs/design-system.spec.md<br/>+ ADR 0001: Figma owns design tokens"]

    FIG --> BD
    BD --> COL
    BD --> TOK
    MOTJS --> BM --> MOT
    MOTJS --> GE
    GE -- "motion.ease()" --> CHOR["GSAP choreography<br/>js/choreography/"]
    GE -- "designTokens.ease" --> RDR
    HAND --> L1
    COL --> L4
    TOK --> L4
    MOT --> L4

    CSS -- "tokens reached via utilities<br/>(bg-neutral-900, p-18)" --> COMP
    API -. governs .-> COMP
    COMP -- "mirrored path 1:1" --> IA
    GEN -- "readers: colors, designTokens" --> RDR

    SPEC -. defines .-> SOURCES
    SPEC -. defines .-> API
    E1 -. guards .-> COMP
    E1 -. guards .-> CSS
    E2 -.-> IA
    E3 -.-> COMP
    E4 -.-> MOT
    E5 -.-> REF
```

## See also

- [Design system spec](../design-system.spec.md)
- [Component API spec](../views/component-api.views-spec.md)
- [Figma sync](../../figma/README.md)
- [Motion tokens](../../js/choreography/tokens/motion/motion.md)
- [Design system inventory](../../reports/design-system/inventory.md)
