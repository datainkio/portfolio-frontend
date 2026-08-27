# Graph Report - .  (2026-08-27)

## Corpus Check
- 8 files · ~212,406 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 2437 nodes · 3446 edges · 324 communities (185 shown, 139 thin omitted)
- Extraction: 96% EXTRACTED · 3% INFERRED · 0% AMBIGUOUS · INFERRED: 114 edges (avg confidence: 0.76)
- Token cost: 0 input · 0 output

## Community Hubs (Navigation)
- Community 0
- NPM Build Scripts
- Motion Atom Library
- Choreography System Core
- Process Blockframes UI Components
- Community 2
- Community 3
- Gel Geometry Rendering
- Community 21
- tailwindcss
- GSAP Vendor Bundle (minified)
- Community 6
- Dev Dependencies
- Sanity Content Schemas
- Community 7
- Community 14
- Community 12
- Community 13
- Community 22
- Blockframes Canvas Animation
- Section Controllers and Bus
- Community 17
- templates/Text.js
- Award & Section Header Timelines
- Community 26
- Community 23
- Community 29
- Community 19
- Work Section
- Community 24
- Blockframes Builder
- Utils Package (Logger, Color, Math)
- Package Metadata
- Community 38
- Hero Section
- Build Pipeline Scripts
- Community 10
- Gel Core
- Motion Specs and Tokens
- Community 37
- Community 30
- Awards Section
- Process Section
- Cart Item.js
- Environment Info Scripts
- Community 44
- Community 51
- Community 48
- GelAnimationManager API
- CSS Build Script
- System Health Check
- Community 55
- Blockframes Core
- Choreography Build Script
- Community 61
- Component Scaffold Script
- Static File Server
- Community 64
- Landing Performance Planning
- Community 16
- Tailwind Build Logger
- Community 68
- GlobalHeader Scroll Hide
- Community 70
- Preview Build Script
- Logger Style Tests
- Breakpoint & Header Config
- Community 77
- Projects Alternate Grid
- CSS Architecture
- Animation Bus Tests
- Layout Templates
- Community 83
- Eleventy Navigation Builder
- Head Partials & Director
- Bio Section Controller
- Reduced Motion and Card Motion
- AnimationBus Emitter
- Grid Generator Script
- Gel Modules
- Community 91
- ScrollEffectsCoordinator
- Gel Core
- Gel Core
- WorkHeader Collapse
- Bio Motion Split
- Template Partials
- Hero Events Tests
- TailwindLogger.js
- Preloader
- BuildInfoManager
- syncContent.js
- enhancements.test.js
- error-detection.test.js
- Preloader Boot Gating
- SectionCapManager
- WorkNavManager.md
- WorkNavManager
- Card Manager Variants
- logDirectoryStructure.js
- validateEnvironment.js
- enhancements-demo.test.js
- script-outline.test.js
- Community 119
- Community 120
- Choreography Contracts Config
- WorkHeaderManager.md
- GSAP Vendor Bundle (minified)
- exportDiagrams.js
- Community 127
- Community 128
- Contact Form Schema
- Home transforms
- Portable Text transforms
- Director Boot and Audit
- AnimationDirector.js
- Community 135
- CardManager Lifecycle
- CardTriggers.js
- landing-header.js
- Logger utility (js/utils/logger/index.js)
- author
- colorUtils.js
- install-git-hooks.mjs
- airtable-styles-preview.js
- logger/index.js
- simple-enhancements.test.js
- Community 147
- Sanity client
- Post reference projection
- SKOS concept projection
- Awards query
- Home query
- Image assets query
- Industries query
- Navigation query
- Organizations query
- Outcomes query
- Posts query
- Project pages query
- Roles query
- User guide query
- sanityService
- Navigation transforms
- Project transforms
- Projects landing transforms
- Community 166
- NavigationBuilder Init
- pre-commit
- displays.md
- CardTriggers
- handleLinkClick
- Motion Tokens
- utils/color.js
- buildDirectoryNav
- showAvailableWorkflows.js
- errors.test.js
- CustomError
- lumberjack-dual-mode.test.js
- Community 179
- Community 180
- Community 181
- Activity projection
- Award projection
- featuredImageProjection.js
- Featured image projection
- industryProjection.js
- Industry projection
- Organization projection
- outcomeProjection.js
- Outcome projection
- pageProjection.js
- Page projection
- postProjection.js
- Project page projection
- Projects landing projection
- Role projection
- Site settings projection
- CONCEPT_PROJECTION
- User guide projection
- Bug Issue Template
- Community 202
- Choreography Contracts README
- ix barrel
- tailwind.motion.config.cjs
- AwardsAnimations.md
- Community 208
- Community 209
- theme-tokens.js
- clearCache.js
- tailwind.config.js
- figma-outline.test.js
- styles.test.js
- lumberjack-default-disabled.test.js
- Community 230
- Community 231
- Architecture Entrypoint Docs
- Taxonomy Projections
- Community 234
- Frontend Architecture (AIX-focused)
- Community 241
- Community 242
- Web app manifest.json route
- Manifest Webmanifest Template
- Contact page IA (route frontmatter)
- Community 247
- Community 248
- Community 249
- Community 250
- Community 251
- Community 252
- Community 253
- Community 258
- Community 260
- Community 261
- Community 262
- PROJECTS_TRIGGER
- Community 269
- Community 271
- Community 272
- Architect
- Community 303
- Community 304
- ParallaxGroup
- BlurEffect
- ShadowEffect
- StaggerEffect
- Interstitials README (empty)
- Layouts package (element positioning scripts)
- Vector3
- colorUtils.js
- Community 318
- Community 319
- Community 321
- Community 323
- Community 324
- Community 325
- Community 326
- Community 327
- Community 328
- Community 329
- Community 330
- Community 331
- Community 332
- Community 333
- Community 334
- Community 335
- Community 336
- Community 337
- Community 338
- Community 339
- Community 340

## God Nodes (most connected - your core abstractions)
1. `scripts` - 69 edges
2. `motion` - 33 edges
3. `AbstractSection` - 32 edges
4. `AbstractSectionAnimations` - 23 edges
5. `HomeHeaderManager` - 22 edges
6. `LandingSequence` - 22 edges
7. `TIMELINE_IDS` - 21 edges
8. `init()` - 20 edges
9. `Content Schemas` - 19 edges
10. `AnimationDirector` - 18 edges

## Surprising Connections (you probably didn't know these)
- `serializePortableTextToHtml()` --references--> `Lightbox`  [AMBIGUOUS]
  data/sanity/transforms/portableText.js → js/lightbox/Lightbox.md
- `serializePortableTextToHtml()` --references--> `Lightbox Molecule`  [AMBIGUOUS]
  data/sanity/transforms/portableText.js → views/molecules/lightbox/lightbox.md
- `exportDiagrams.js` --semantically_similar_to--> `exportStoryboards()`  [INFERRED] [semantically similar]
  scripts/README.scripts.md → scripts/diagrams/exportStoryboards.js
- `IA Frontmatter Schema` --semantically_similar_to--> `Eleventy Collections Manager README`  [INFERRED] [semantically similar]
  docs/ia/frontmatter.md → eleventy/collections/README.collections.md
- `buildChoreography.js` --references--> `AnimationDirector`  [EXTRACTED]
  scripts/README.scripts.md → js/choreography/AnimationDirector.js

## Import Cycles
- 2-file cycle: `js/choreography/molecules/card-motion/card-motion.js -> js/choreography/molecules/card-motion/sticky.js -> js/choreography/molecules/card-motion/card-motion.js`

## Hyperedges (group relationships)
- **Homepage boot-to-landing narrative flow** — js_choreography_templates_landing_landingsequence_boot_gates, js_choreography_templates_landing_landingsequence_landingsequence, js_choreography_templates_landing_landingsequence_serial_landing_chain, js_choreography_templates_landing_landingsequence_animationbus_contract [EXTRACTED 1.00]
- **Invariants that keep the landing chain from stalling** — js_choreography_templates_landing_landingsequence_outro_cue_deadlock_avoidance, js_choreography_templates_landing_landingsequence_reduced_motion_zeroed_holds, js_choreography_templates_landing_landingsequence_delayedcall_timers, js_choreography_templates_landing_landingsequence_gel_entrance_gate [INFERRED 0.85]
- **Agent orientation and effort-budgeting system** — claude_orientation_protocol, claude_context_load_tier, claude_model_selection, claude_agent_routing, claude_current_goals [INFERRED 0.85]
- **Choreography runtime: Director → Bus → AbstractSection → LandingSequence** — choreography_animationdirector_concept, choreography_animationbus_concept, choreography_abstractsection_concept, choreography_landingsequence_concept [EXTRACTED 1.00]
- **Filter modules registered through the filters barrel** — eleventy_filters_filters, eleventy_filters_array, eleventy_filters_color, eleventy_filters_date, eleventy_filters_dom, eleventy_filters_file, eleventy_filters_image, eleventy_filters_string [EXTRACTED 1.00]
- **Atomic motion primitives layer (atoms)** — js_choreography_atoms_index, js_choreography_atoms_fade_fade, js_choreography_atoms_slide_slide, js_choreography_atoms_scale_scale, js_choreography_atoms_clip_reveal_clip_reveal, js_choreography_atoms_stagger_reveal_stagger_reveal, js_choreography_atoms_text_split_reveal_text_split_reveal, js_choreography_atoms_parallax_parallax [EXTRACTED 1.00]
- **Reduced-motion variant-swap pattern across sections** — js_choreography_molecules_award_motion_reduced, js_choreography_molecules_bio_motion_reduced, js_choreography_molecules_hero_motion_simple, js_choreography_config_ix_profiles [INFERRED 0.85]
- **Process Blockframes grid fill + staggered reveal pipeline** — js_choreography_molecules_process_motion_blockframes_grid, js_choreography_molecules_process_motion_blockframes, js_displays_blockframes_builder, js_choreography_molecules_process_motion_reveal [EXTRACTED 1.00]
- **Process section variant composition (process-motion + reveal + gel + ui-loop)** — js_choreography_molecules_process_motion_process_motion, js_choreography_molecules_process_motion_reveal, js_choreography_molecules_process_motion_section_gel, js_choreography_molecules_process_motion_ui_components_loop [EXTRACTED 1.00]
- **Fixed-container gel scroll-sync pattern (process + bio)** — js_choreography_molecules_process_motion_section_gel, js_choreography_molecules_bio_motion_heading_gel, js_choreography_molecules_process_motion_section_gel_attachsectiongel [INFERRED 0.90]
- **Unscrubbed lifecycle-driven reveal fallback (Awards/Bio/Hero triggers)** — js_choreography_organisms_awards_awardstriggers_bind, js_choreography_organisms_bio_biotriggers_bind, js_choreography_organisms_hero_herotriggers_bind, js_choreography_system_abstractsection_playintro [INFERRED 0.90]
- **Section controller / animations / triggers triad pattern** — js_choreography_organisms_organizations_organizations, js_choreography_organisms_organizations_organizationsanimations, js_choreography_organisms_organizations_organizationstriggers, js_choreography_organisms_process_process, js_choreography_organisms_process_processanimations, js_choreography_organisms_process_processtriggers, js_choreography_organisms_work_work, js_choreography_organisms_work_workanimations, js_choreography_organisms_work_worktriggers [INFERRED 0.85]
- **Home Page Sanity-to-Template Pipeline** — data_sanity_queries_home, data_sanity_transforms_home, eleventy_collections_sanity, ia_index, views_pages_home_home [EXTRACTED 1.00]
- **Component Registry Documentation Pattern** — views__registry__registry, views_atoms_icon, views_atoms_button_button [EXTRACTED 1.00]
- **Atomic Design Atom Layer Components** — views_atoms_avatar, views_atoms_award, views_atoms_cta, views_atoms_field, views_atoms_gel, views_atoms_heading, views_atoms_icon, views_atoms_input, views_atoms_organization, views_atoms_project, views_atoms_ruler, views_atoms_textformat, views_atoms_button_button [EXTRACTED 1.00]
- **Print marks atom family** — views_atoms_printmarks_ink_marks_render, views_atoms_printmarks_margin_bleed_marks_render, views_atoms_printmarks_registration_marks_render, views_atoms_printmarks_trim_marks_render [INFERRED 0.75]
- **UI components loop choreography contract** — views_atoms_svg_ui_components_loop_render, js_choreography_molecules_process_motion_ui_components_loop, specs_animation_ui_components_animation_spec, data_process_el_uicomponents [EXTRACTED 0.90]
- **Base layout shell composition** — views_layouts_base_base, views_organisms_header_global_header, views_organisms_footer_global_footer, views_organisms_navigation_skip_links_nav, views_templates_partials_head [EXTRACTED 0.90]
- **Sanity Card View-Model Normalization** — views_molecules_card_project, views_molecules_card_organization, views_molecules_card_award, eleventy_collections_sanity [EXTRACTED 0.90]
- **Printmarks Macro Composition** — views_molecules_printmarks, views_atoms_printmarks_ink_marks, views_atoms_printmarks_trim_marks, views_atoms_printmarks_margin_bleed_marks, views_atoms_printmarks_registration_marks [EXTRACTED 0.85]
- **Section Cap Scroll Context Managers** — views_molecules_section_cap, js_choreography_organisms_bio_buildinfomanager, js_choreography_organisms_homeheadermanager, js_choreography_organisms_worknavmanager [EXTRACTED 0.85]
- **Site-wide footer composition** — views_organisms_footer_global_footer_render, views_molecules_list_main_pages_render [EXTRACTED 0.85]
- **Home header loader/hero/menu role state machine** — views_organisms_header_home_home_landing_home_landing, views_organisms_navigation_page_nav_render, js_choreography_managers_homeheadermanager_homeheadermanager [EXTRACTED 0.90]
- **Project page header assembly** — views_organisms_header_project_project_header_render, views_molecules_project_metadata_project_metadata_render, views_molecules_list_project_orgs_render, views_organisms_navigation_breadcrumbs_nav_render [EXTRACTED 0.90]
- **Sanity-to-template data pipeline for project page** — ia_project, data_sanity_queries_project_project_pages, data_sanity_projections_project_projectpageprojection, data_sanity_transforms_project, views_pages_project_project [EXTRACTED 1.00]
- **Atomic motion layer stack** — js_choreography__context_choreography_atomic_motion_tokens, js_choreography__context_choreography_atomic_motion_atoms, js_choreography__context_choreography_atomic_motion_molecules, js_choreography__context_choreography_atomic_motion_organisms, js_choreography__context_choreography_atomic_template_flows [EXTRACTED 1.00]
- **Build-time CMS data pipeline (config → client → fetch → projection → collection)** — data_sanity_readme_sanity_env_config, data_sanity_readme_sanity_cms_client, data_sanity_readme_sanity_fetchsanitydata, data_sanity_readme_sanity_cms_queries, data_sanity_projections_project_projectcardprojection_project_card_projection, data_sanity_readme_sanity_eleventy_collections_flow [EXTRACTED 1.00]
- **Gel sync suspend/resume contract shared by the bio bands** — js_choreography_molecules_bio_motion_heading_gel_suspendheadinggelsync, js_choreography_molecules_bio_motion_heading_gel_resumeheadinggelsync, js_choreography_molecules_bio_motion_overview_gel_suspendoverviewgelsync, js_choreography_molecules_bio_motion_overview_gel_resumeoverviewgelsync, js_choreography_molecules_bio_motion_mission_statement_attachmissionstatement, js_choreography_molecules_bio_motion_heading_gel_suspension_defers_not_discards [EXTRACTED 1.00]
- **Two-channel developer narrative (ADR 0005)** — views_pages_home_home_html_comment_channel, views_templates_partials_dev_note_console_channel, views_templates_partials_dev_note_adr_0005_dev_channel_narrative [EXTRACTED 1.00]
- **Award record build + inline SVG hydration** — data_sanity_transforms_award_buildawardcardrecord, data_sanity_transforms_award_hydrateawardinlinelogos, data_sanity_transforms_award_fetchsvgmarkup, data_sanity_transforms_award_normalizeawardrecords [EXTRACTED 1.00]
- **Shared project card URL resolution across queries/transforms** — data_sanity_transforms_project_resolveprojectcardurl, data_sanity_transforms_home_normalizelandingrecords, data_sanity_queries_project_projects_projectsquery, data_sanity_queries_project_projects_by_industry_projectsbyindustryquery [INFERRED 0.85]
- **Choreography boot sequence participants** — js_choreography_animationdirector_animationdirector, js_choreography_system_animationbus_animationbus, js_choreography_templates_landing_landingsequence_landingsequence, js_choreography_system_registry_registry, js_preloader_preloader_preloader [EXTRACTED 1.00]
- **Sanity CMS to 11ty content pipeline** — data_sanity_client_client, data_sanity_fetchsanitydata_fetchsanitydata, data_sanity_queries_queries, eleventy_collections_sanity_sanity, views_layouts_case_study_case_study [EXTRACTED 1.00]
- **Frontend AIX documentation entrypoint set** — docs_ai_readme_ai, docs_ai_start_here, docs_ai_workspace_portability, docs_ai_aix_maintenance, docs_ai_aix_maintenance_checklist [EXTRACTED 1.00]
- **IA route files share the eleventyComputed + CMS-collection binding pattern** — ia_index, ia_project, ia_projects, ia_user_guide [INFERRED 0.75]
- **Atomic Design Documentation Tiers** — ia_docs_design_atoms_readme, ia_docs_design_molecules_readme, ia_docs_design_organisms_readme, ia_docs_design_templates_readme, ia_docs_design_layouts_readme [EXTRACTED 1.00]
- **Sanity Content Document Layer** — ia_docs_content_strategy_schemas_project, ia_docs_content_strategy_schemas_post, ia_docs_content_strategy_schemas_award, ia_docs_content_strategy_schemas_organization, ia_docs_content_strategy_schemas_insight [EXTRACTED 1.00]
- **Homepage Section Rendering via Njk Macros** — ia_docs_design_organisms_section_awards_readme, ia_docs_design_organisms_section_bio_readme, ia_docs_design_organisms_readme [INFERRED 0.85]
- **Blockframes atomic-design paint pipeline (atoms→molecules→organisms→templates)** — js_displays_blockframes_atoms_readme_atoms_atoms, js_displays_blockframes_molecules_readme_molecules_molecules, js_displays_blockframes_organisms_readme_organisms_organisms, js_displays_blockframes_templates_readme_templates_templates, js_displays_blockframes_painter_painter [EXTRACTED 0.95]
- **Frontend production build pipeline (design→css→js→ 11ty)** — scripts_fetchfigma_fetchfigma, scripts_buildcss_buildcss, scripts_buildchoreography_buildchoreography, build_order_rationale [EXTRACTED 0.95]
- **Figma-to-Tailwind Typography Build Pipeline** — figma_services_typographyservice, styles_typography_imports_css, styles_typography_fontfamilies_css [EXTRACTED 1.00]

## Communities (324 total, 139 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.05
Nodes (58): clean(), createSanityClient(), errorStyle, infoStyle, resolveSanityConfig(), sanitizeConfigForLogs(), CMS_QUERIES, cacheStyle (+50 more)

### Community 1 - "NPM Build Scripts"
Cohesion: 0.03
Nodes (69): scripts, build, build:11ty, build:css, build:css:dev, build:debug, build:design, build:design:debug (+61 more)

### Community 2 - "Motion Atom Library"
Cohesion: 0.06
Nodes (48): Motion Profile Resolution Layer, clip-reveal atom, CLIP_HIDDEN, clipRevealIn(), clipRevealOut(), fade atom, fadeIn(), fadeOut() (+40 more)

### Community 3 - "Choreography System Core"
Cohesion: 0.05
Nodes (39): AbstractSection base class, AnimationBus (pub/sub), AnimationDirector (master coordinator), config/contracts/selectors/selectors.js, GSAP plugin registration (system/gsap.js), LandingSequence, ACTIVITY_PROJECTION, AWARD_PROJECTION (+31 more)

### Community 4 - "Process Blockframes UI Components"
Cohesion: 0.05
Nodes (46): ui components anim.svg, Atomic Design Pattern (atoms→molecules→organisms→templates), data-process-el=uicomponents hook family, PROCESS_SELECTORS, blockframes.js (Process Blockframes reveal), buildBlockframesReveal(), Non-literal dynamic import to keep blockframes package out of bundle, fillBlockframesGrid() (+38 more)

### Community 5 - "Community 2"
Cohesion: 0.07
Nodes (51): animateExit(), animateIntro(), once(), PRELOADER_ANIMATION, PRELOADER_ANIMATION_MESSAGES, PRELOADER_ASSET, PRELOADER_ATTRIBUTES, PRELOADER_CONTROLLER_MESSAGES (+43 more)

### Community 6 - "Community 3"
Cohesion: 0.06
Nodes (32): Frontend Agent Roster, Build Order — design → css → 11ty, Choreography Quick Reference, Context Load Tier, Frontend Critical Constraints, Current Goals — vault-root Project Manager, Frontend — Claude Code Entrypoint, GSAP Skill Routing (+24 more)

### Community 7 - "Gel Geometry Rendering"
Cohesion: 0.06
Nodes (18): DEFAULT_COLOR_CLASSES, MASK_STYLE, GelGeometry, GelManipulator, GelMask, GelVisualState, gel/index.js public API, Gel Effects Doc (+10 more)

### Community 8 - "Community 21"
Cohesion: 0.07
Nodes (33): HERO_SELECTORS, HERO_INTRO, HERO_LANDING, ACCESSIBILITY_SETTINGS, isReducedMotion(), ReducedMotionHandler, Cache/revert SplitText instance across matchMedia rebuilds, CLEAR (+25 more)

### Community 9 - "tailwindcss"
Cohesion: 0.04
Nodes (47): @11ty/eleventy, @11ty/eleventy-fetch, @11ty/eleventy-img, @11ty/eleventy-navigation, cheerio, @datainkio/lumberjack, @datainkio/textparty, dotenv (+39 more)

### Community 10 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.09
Nodes (20): AIX context hygiene principle, Link, don't fork (AI docs portability), Reduced-motion graceful degradation, AIX Maintenance Loop (frontend), AIX Maintenance Checklist (Copilot-First Repos), Canonical choreography patterns, Canonical JS initialization patterns, Canonical template patterns (+12 more)

### Community 11 - "Community 6"
Cohesion: 0.05
Nodes (23): Array filters, NOTE: Works with both single values and array values (uses first item), Color filters, hexToRgb(), multiplyBlend(), rgbToHex(), Date filters, NOTE: Works with both JavaScript Date objects and ISO 8601 date strings. (+15 more)

### Community 12 - "Dev Dependencies"
Cohesion: 0.06
Nodes (34): ansi-colors, chalk, cli-progress, djlint, msgStyle, lightbox(), picture(), loremChars() (+26 more)

### Community 13 - "Sanity Content Schemas"
Cohesion: 0.08
Nodes (40): Content Graph, Content Strategy Docs, Content Schemas, Activity Taxonomy, AWARD Schema, IMAGE_ASSET Schema, ImageMeta Object, Industry Taxonomy (+32 more)

### Community 14 - "Community 7"
Cohesion: 0.10
Nodes (17): SELECTORS, TODO: The complexity of the choreography has grown past what a simple, BACKGROUND_TRIGGER, ORGANIZATIONS_TRIGGER, SCROLL_DEFAULTS, AwardsTriggers.js, AWARDS_TRIGGER, BackgroundVideoTriggers.js (+9 more)

### Community 15 - "Community 14"
Cohesion: 0.09
Nodes (18): RULER_DEFAULTS, RULER_INTRO_DEFAULTS, choreography/config/ruler.js, RulerIntroManager, initRulerIntro(), RulerIntroManager, CompositeDisplay, DisplayManager (+10 more)

### Community 16 - "Community 12"
Cohesion: 0.09
Nodes (14): contactSubmission schema, data/sanity/transforms/portableText.js, ContactForm, LIMITS, MESSAGES, sanitize(), Lightbox, Progressive enhancement (no-JS fallback) pattern (+6 more)

### Community 17 - "Community 13"
Cohesion: 0.07
Nodes (31): TypographyService.js, Typography Font Loading Order, fontFamilies.css (auto-generated), imports.css, Typography System Architecture README, Component Registry (_registry.njk), registry macro: button, registry macro: component (+23 more)

### Community 18 - "Community 22"
Cohesion: 0.10
Nodes (25): AWARD_SELECTORS, breakpoints config, AWARDS_INTRO, CARD_STATIC, CARD_STICKY, getActiveMotionProfileKey(), getCardVariantOverride(), MOTION_PROFILES (+17 more)

### Community 19 - "Blockframes Canvas Animation"
Cohesion: 0.10
Nodes (4): AnimationManager, CanvasManager, Halftone, HalftoneEffect

### Community 20 - "Section Controllers and Bus"
Cohesion: 0.10
Nodes (12): BackgroundVideo (section controller), Organizations, GlobalHeaderManager, NullAnimationBus, PromiseResolverQueue, ReducedMotionHandler, getSectionIds(), getSectionName() (+4 more)

### Community 21 - "Community 17"
Cohesion: 0.10
Nodes (14): Brief-to-implementation divergence warning, Lifecycle correctness and cleanup (no memory leaks), Reduced-motion and accessibility strategy, Choreography registry system (registry.register — superseded), Responsive choreography (gsap.matchMedia breakpoint timelines), Semantic hook strategy (data-choreo — superseded), Separate structure from choreography, AnimationDirector (+6 more)

### Community 22 - "templates/Text.js"
Cohesion: 0.12
Nodes (15): article(), basic(), block(), blog(), calendar(), cart(), chart(), contact() (+7 more)

### Community 23 - "Award & Section Header Timelines"
Cohesion: 0.15
Nodes (10): TIMELINE_IDS, ORGANIZATIONS_ANIMATION_DEFAULTS, AWARD_VARIANT_FACTORIES, createSectionHeaderIntro(), NOTE: This might be better defined along with the other factory methods in AWARD, BioAnimations.js, NOTE: This might be better defined along with the other factory methods in BIO_V, AnimationDirector (+2 more)

### Community 24 - "Community 26"
Cohesion: 0.11
Nodes (21): BIO_GEL_ENTRANCE, HomeHeaderManager._settleToCurrentRole, Debounced resize settle for the parked header transform, attachHeadingGel(), BIO_GEL_ENTRANCE token, buildHeadingGelEntrance(), getHeadingGelEl(), Gels are never ScrollTrigger pin targets (+13 more)

### Community 26 - "Community 29"
Cohesion: 0.13
Nodes (13): scroll-reveal-group.js, section-header-intro.js, Awards.js, AwardsAnimations organism, AwardsTriggers.bind(), BioTriggers.bind(), BIO_TRIGGER, BioTriggers (+5 more)

### Community 27 - "Community 19"
Cohesion: 0.12
Nodes (18): ANIMATION_DEFAULTS, AWARDS_ANIMATION_DEFAULTS, BIO_ANIMATION_DEFAULTS, BIO_INTRO_HOLD, BIO_MISSION_REVEAL, BIO_OUTRO, HERO_OUTRO, HOME_HERO_BUILD (+10 more)

### Community 28 - "Work Section"
Cohesion: 0.11
Nodes (4): Work, selectWorkEl(), WorkAnimations, WorkTriggers

### Community 29 - "Community 24"
Cohesion: 0.15
Nodes (12): BIO_SELECTORS, BIO_INTRO, createFadeIn(), createFadeOut(), Bio fade variant currently inert (commented out), selectBioEl(), Bio reduced variant hides gel as correct rest state, bioRectAsViewportPercent() (+4 more)

### Community 30 - "Blockframes Builder"
Cohesion: 0.12
Nodes (5): Builder, BlockLine, Cloud layout, Grid layout, Blockframes Layouts (positioning algorithms)

### Community 31 - "Utils Package (Logger, Color, Math)"
Cohesion: 0.11
Nodes (15): preloader logger, assetPath (getAssetPath/getImagePath/getVideoPath), ColorSpace, ThemeColors (color), MemoryProfiler, ScrollBlockedDiagnostic, Logger (utils, singleton), LoggerStyle (+7 more)

### Community 32 - "Package Metadata"
Cohesion: 0.10
Nodes (19): browserslist, bugs, url, description, engines, node, npm, homepage (+11 more)

### Community 33 - "Community 38"
Cohesion: 0.18
Nodes (11): VIDEO_SELECTORS, BACKGROUND_ANIMATION_DEFAULTS, scroll-reveal-group molecule, section-header-intro molecule, video-reveal molecule, video-reveal.js, buildVideoIntro(), createVideoReveal() (+3 more)

### Community 34 - "Hero Section"
Cohesion: 0.13
Nodes (3): Hero, HeroAnimations, HeroTriggers

### Community 35 - "Build Pipeline Scripts"
Cohesion: 0.12
Nodes (15): Frontend build order (clean→design→css→js→ 11ty), buildChoreography.js, buildPreview.js, clearCache.js, clearSiteFolder(), preserveDirs, siteFolder, exportDiagrams.js (+7 more)

### Community 36 - "Community 10"
Cohesion: 0.15
Nodes (3): AbstractSectionAnimations, EMPTY_TIMELINES(), TIMELINE_BUILDERS

### Community 38 - "Motion Specs and Tokens"
Cohesion: 0.17
Nodes (17): Two-Gel Backing Composition Pattern, GSAP vs Tailwind Decision Rubric, Viewport-Normalized Gel Arrangement Schema, Time-Driven Hero-to-Menu Seam Pattern, config/arrangements.js, arrangements.js (displays config), config/motion.js (token source of truth), tailwind.motion.config.cjs (+9 more)

### Community 39 - "Community 37"
Cohesion: 0.21
Nodes (17): Collection initialization dependency order (Sanity before Navigation), Eleventy service layer pattern, Sanity client.js, fetchSanityData.js, projects.js query projection, data/sanity/queries.js, Sanity to 11ty data flow, Collections index sidecar (+9 more)

### Community 40 - "Community 30"
Cohesion: 0.12
Nodes (17): HomeHeaderManager._arm, HomeHeaderManager._buildDeconstruct, HomeHeaderManager._buildMenuIn, HomeHeaderManager._enterHeroRole, HomeHeaderManager._enterMenuRole, HomeHeaderManager._playMenuIn, HomeHeaderManager._readSeamTokens, HomeHeaderManager._runTransition (+9 more)

### Community 41 - "Awards Section"
Cohesion: 0.15
Nodes (4): resolveSectionMotionProfile(), Awards, AwardsAnimations, AwardsTriggers

### Community 42 - "Process Section"
Cohesion: 0.15
Nodes (5): Process, Process, ProcessAnimations, ProcessTriggers, process-motion/blockframes.js

### Community 44 - "Environment Info Scripts"
Cohesion: 0.22
Nodes (10): display11tyInfo(), getEleventyVersion(), displayEnvironmentInfo(), main(), __dirname, displayTailwindInfo(), main(), init11ty() (+2 more)

### Community 45 - "Community 44"
Cohesion: 0.15
Nodes (16): hanko render macro, Icon component, nav-link render macro, site-title render macro, Child Pages component, Projects By Industry render macro, Main Pages render macro, Global Footer render macro (+8 more)

### Community 46 - "Community 51"
Cohesion: 0.23
Nodes (13): attachMissionStatement(), Mission reveal owns its own ScrollTrigger, not the intro timeline, revealed, revealed WeakSet rebuild guard, selectBioEl(), attachOverviewGel(), getOverviewGelEl(), pending (+5 more)

### Community 47 - "Community 48"
Cohesion: 0.18
Nodes (13): featuredImage field (dereferenced imageAsset), featuredVideo field (dereferenced videoAsset), Poster precedence rule, PROJECT_CARD_PROJECTION, Thin queries / composable projection shapes, CMS client (client/index.js), CMS Integration entrypoint (frontend/data/sanity), CMS_QUERIES aggregate (+5 more)

### Community 48 - "GelAnimationManager API"
Cohesion: 0.18
Nodes (8): EVENTS, GelAnimationManager, GlobalHeaderManager, ProjectHeaderManager, ScrollEffectsCoordinator, ScrollSmootherManager, SessionManager, gel-transition.js

### Community 49 - "CSS Build Script"
Cohesion: 0.21
Nodes (12): buildCSS(), buildCSS.js sidecar, __dirname, errorStyle, __filename, main(), parseTailwindOutput(), projectRoot (+4 more)

### Community 50 - "System Health Check"
Cohesion: 0.26
Nodes (13): checkBuildTools(), checkDependencies(), checkEnvironmentVariables(), checkFileSystem(), checkNodeEnvironment(), __dirname, __filename, generateHealthReport() (+5 more)

### Community 51 - "Community 55"
Cohesion: 0.23
Nodes (13): backend project.ts schema, content-model project-page pattern, projectPageProjection.js, project-pages.js (projectPages query), transforms/project.js, Project Page Sanity-to-Template Data Flow, Single Project Page Template Spec, ProjectOrgs.render macro (+5 more)

### Community 52 - "Blockframes Core"
Cohesion: 0.22
Nodes (7): IMPORTANT: Builder.js handles the actual insertion logic. See Builder.js, build(), buildings(), drawFace(), drawStory(), roof(), scaleFace()

### Community 53 - "Choreography Build Script"
Cohesion: 0.15
Nodes (11): args, buildOptions, cliForcesBundle, __dirname, entryPoint, envBundlePreference, __filename, outDir (+3 more)

### Community 54 - "Community 61"
Cohesion: 0.23
Nodes (3): BUILD_INFO_SELECTORS, BuildInfoManager, createArticleNavToggle()

### Community 55 - "Component Scaffold Script"
Cohesion: 0.26
Nodes (11): __dirname, __filename, generateComponent(), generateSection(), listComponents(), main(), projectRoot, sectionTemplates (+3 more)

### Community 56 - "Static File Server"
Cohesion: 0.17
Nodes (9): args, COMPRESSIBLE, __dirname, __filename, MIME, PORT, projectRoot, ROOT (+1 more)

### Community 57 - "Community 64"
Cohesion: 0.20
Nodes (11): Card Dealt/Flicked Fish-River Metaphor, WorkHeaderManager, WorkHeaderManager, Card Motion Spec, Work Section Motion Spec, Work Section Navigation Spec, project card molecule, Featured Image Molecule (+3 more)

### Community 58 - "Landing Performance Planning"
Cohesion: 0.20
Nodes (11): LCP asset + font preload strategy, Plan: Finish Remaining Performance TODOs (AI copy), Plan: Finish Remaining Performance TODOs, Data and Context, Head, Notes for Future Maintenance, Open Questions, Purpose (+3 more)

### Community 61 - "Community 68"
Cohesion: 0.18
Nodes (5): AnimationDirector, EVENTS contract, Animation Manager Modules (README), SectionCapManager, section registry

### Community 62 - "GlobalHeader Scroll Hide"
Cohesion: 0.27
Nodes (3): GlobalHeaderManager, mq, reducedMotionHandler

### Community 63 - "Community 70"
Cohesion: 0.18
Nodes (11): BuildInfoManager.js, HomeHeaderManager.js, WorkNavManager.js, Ink Marks Atom, Margin Bleed Marks Atom, Registration Marks Atom, Trim Marks Atom, Printmarks Molecule (+3 more)

### Community 64 - "Preview Build Script"
Cohesion: 0.24
Nodes (10): args, __dirname, __filename, isDev, isVerbose, main(), projectRoot, showDesignSystemSync() (+2 more)

### Community 65 - "Logger Style Tests"
Cohesion: 0.18
Nodes (10): blueStyle, customSuccess, cyanStyle, debugData, debugStyle, infoStyle, orangeStyle, pinkStyle (+2 more)

### Community 66 - "Breakpoint & Header Config"
Cohesion: 0.24
Nodes (7): BREAKPOINT_MATCH_MEDIA_CONDITIONS, BREAKPOINT_PRIORITY, getActiveBreakpoint(), TAILWIND_BREAKPOINTS, MEDIA, mq, reducedMotionHandler

### Community 68 - "Projects Alternate Grid"
Cohesion: 0.44
Nodes (9): project(), applyAlternatingStyles(), clearCards(), init(), navigate_projects(), onMouseOut(), onMouseOver(), showSelected() (+1 more)

### Community 69 - "CSS Architecture"
Cohesion: 0.20
Nodes (10): base.css, colors.css, decorations.css, CSS Import Cascade Order Principle, main.css, CSS Architecture README, TailwindLogger service, typography/fontFamilies.css (+2 more)

### Community 70 - "Animation Bus Tests"
Cohesion: 0.20
Nodes (7): abstractLifecycleHooks, __dirname, __filename, listenerMatches, registryMatch, requiredBusApiMarkers, sectionIds

### Community 71 - "Layout Templates"
Cohesion: 0.24
Nodes (9): base layout, cols-2-after layout, Cols 2 Before Layout, cols-2-before layout, Cols 3 Layout, global-header organism, breadcrumbs-nav organism, docs-nav organism (+1 more)

### Community 72 - "Community 83"
Cohesion: 0.25
Nodes (9): data/sanity/queries/home.js, data/sanity/transforms/home.js, Home Page Template Spec, Home Page Sanity-to-Template Data Flow, Award atom (award.njk), Organization atom (organization.njk), inline svg atom, Awards (+1 more)

### Community 73 - "Eleventy Navigation Builder"
Cohesion: 0.33
Nodes (7): addProjectsNav(), addTopLevelNav(), formatDirectoriesForEleventyNav(), formatProjectsForEleventyNav(), getParentFromSlug(), successInitStyle, titleInitStyle

### Community 74 - "Head Partials & Director"
Cohesion: 0.28
Nodes (8): choreography/Director.js, Organisms Directory README, Choreography Script partial, Fonts partial, GTM Noscript partial, GTM Script partial, Robots partial, README.templates

### Community 78 - "Grid Generator Script"
Cohesion: 0.39
Nodes (7): drawCircle(), drawGrid(), drawOppositeCircles(), generateLittleBlock(), generateNewGrid(), getTwoColors(), init()

### Community 79 - "Gel Modules"
Cohesion: 0.36
Nodes (8): ensureDir(), exportStoryboards(), extractMermaidBlocks(), INPUT_DIR, OUTPUT_DIR, runMmdc(), TMP_DIR, writeTempMermaid()

### Community 80 - "Community 91"
Cohesion: 0.22
Nodes (9): hanko atom, base layout, project-cards molecule, Hero, README.section (organisms/section), Projects page, Blog layout, Case Study layout (+1 more)

### Community 85 - "Bio Motion Split"
Cohesion: 0.39
Nodes (6): BIO_VARIANT_FACTORIES, buildHeadingSplit(), headingSplits, intro(), selectBioEl(), tokenColor()

### Community 86 - "Template Partials"
Cohesion: 0.32
Nodes (7): buildCollection(), directoryToProcess, fs, outputFile, path, readDirectoryStructure(), writeCollectionToFile()

### Community 87 - "Hero Events Tests"
Cohesion: 0.25
Nodes (7): abstractSectionPath, __dirname, eventsPath, __filename, heroPath, missing, requiredMarkers

### Community 88 - "TailwindLogger.js"
Cohesion: 0.29
Nodes (6): errorStyle, metricStyle, processStyle, successStyle, titleStyle, warningStyle

### Community 89 - "Preloader"
Cohesion: 0.29
Nodes (6): GSAP local-copy detection for ScrollSmoother compatibility, preloader animations, preloader constants, Preloader, Source, Vendor README (GSAP local-copy detection note)

### Community 90 - "BuildInfoManager"
Cohesion: 0.29
Nodes (6): DOM contract, Lifecycle, BuildInfoManager, Motion, Notes for future maintenance, State machine

### Community 91 - "syncContent.js"
Cohesion: 0.52
Nodes (6): copyFile(), detectFileType(), findBufferFiles(), getDestinationPath(), getStats(), syncContent()

### Community 92 - "enhancements.test.js"
Cohesion: 0.29
Nodes (6): buildLogger, figmaLogger, logger1, logger2, navigationLogger, tailwindLogger

### Community 93 - "error-detection.test.js"
Cohesion: 0.29
Nodes (6): error1, error2, error3, error4, error5, obj

### Community 94 - "Preloader Boot Gating"
Cohesion: 0.33
Nodes (6): Choreography boot gating (director:ready -> preloader:out -> LandingSequence), AnimationDirector Initialization Sequence, AnimationDirector Initialization Sequence (PDF), Preloader Integration Checklist, Storyboards README, choreography-script.njk bootstrap partial

### Community 96 - "WorkNavManager.md"
Cohesion: 0.33
Nodes (5): Active-region rule, Contract, Deferred, Lifecycle, Reduced motion

### Community 98 - "Card Manager Variants"
Cohesion: 0.33
Nodes (4): selectCardEl(), VARIANT_FACTORIES, VARIANT_RESET, CardManager.js

### Community 99 - "logDirectoryStructure.js"
Cohesion: 0.40
Nodes (5): getDirectoryStructure(), ignorePatterns, logDirectoryStructure(), outputFile, startPath

### Community 100 - "validateEnvironment.js"
Cohesion: 0.53
Nodes (5): validateEnvironment(), validateEnvironmentVariables(), validateNodeSetup(), validateProjectStructure(), warnings

### Community 101 - "enhancements-demo.test.js"
Cohesion: 0.33
Nodes (5): buildLogger, deploymentLogger, figmaService, navigationService, sanityService

### Community 102 - "script-outline.test.js"
Cohesion: 0.33
Nodes (5): basicBuildSequence, customStyle, designSyncSequence, devWorkflowSequence, productionSequence

### Community 103 - "Community 119"
Cohesion: 0.50
Nodes (5): sanityService.js, Home page IA (route frontmatter), Project page IA (route frontmatter, paginated), Case Studies landing IA (route frontmatter), User Guide IA (route frontmatter)

### Community 104 - "Community 120"
Cohesion: 0.40
Nodes (5): Motion atoms (fade, slide, scale, blur, parallax, stagger, pin), Motion molecules (interaction patterns), Motion organisms (experience regions, own timelines), Motion tokens (durations, easings, distances, thresholds), Template flows (page-level narrative pacing)

### Community 106 - "WorkHeaderManager.md"
Cohesion: 0.40
Nodes (4): Critical initialization constraint, Removed: `--work-header-h` offset machinery, Responsive drive (collapse `<lg` / open `lg+`), What does not fix this

### Community 108 - "exportDiagrams.js"
Cohesion: 0.40
Nodes (4): args, dirIndex, EXCLUDE_PATTERNS, files

### Community 109 - "Community 127"
Cohesion: 0.50
Nodes (5): Card media: image, or video over image, Reduced motion as absence of action (data-motion-optional deferred video), card.njk render macro, project.njk render macro, Project Cards render macro

### Community 110 - "Community 128"
Cohesion: 0.50
Nodes (4): assets/svg/blockframes.svg, blockframes.js, blockframe-basic render macro, bio.njk (Bio organism)

### Community 111 - "Contact Form Schema"
Cohesion: 0.50
Nodes (4): contactSubmission schema, contact form spec, global-footer organism, Contact

### Community 112 - "Home transforms"
Cohesion: 0.50
Nodes (3): Featured project URLs, Home transforms, Source

### Community 113 - "Portable Text transforms"
Cohesion: 0.50
Nodes (3): Notes, Portable Text transforms, Source

### Community 114 - "Director Boot and Audit"
Cohesion: 0.50
Nodes (4): Choreography Package Code Review (audit.md), Getting Started with Choreography, Choreography System README, JS Modules Overview (README.js.md)

### Community 115 - "AnimationDirector.js"
Cohesion: 0.67
Nodes (3): initDirector(), LOGS, scheduleInit()

### Community 116 - "Community 135"
Cohesion: 0.50
Nodes (4): Heading band decoupled from scroll, heading-gel sync(), Overview band still tracks scroll, deliberately, overview-gel sync()

### Community 118 - "CardTriggers.js"
Cohesion: 0.50
Nodes (3): CARD_DEAL_TRIGGER, CARD_FIGURE_CLIP_TRIGGER, CARD_FIGURE_PARALLAX_TRIGGER

### Community 120 - "Logger utility (js/utils/logger/index.js)"
Cohesion: 0.50
Nodes (4): Logger utility (js/utils/logger/index.js), Logger Test Suite README, Lumberjack Browser Mode Test, Test Suite README

### Community 122 - "author"
Cohesion: 0.50
Nodes (4): author, email, name, url

### Community 123 - "colorUtils.js"
Cohesion: 0.83
Nodes (3): hexToRgb(), multiplyBlend(), rgbToHex()

### Community 124 - "install-git-hooks.mjs"
Cohesion: 1.00
Nodes (3): execGit(), main(), tryExecGit()

### Community 125 - "airtable-styles-preview.js"
Cohesion: 0.50
Nodes (3): airtableStyle, cachingStyle, processingStyle

### Community 126 - "logger/index.js"
Cohesion: 0.50
Nodes (3): __dirname, __filename, tests

### Community 127 - "simple-enhancements.test.js"
Cohesion: 0.50
Nodes (3): buildLogger, customLogger, scopedLogger

### Community 128 - "Community 147"
Cohesion: 0.50
Nodes (4): margin-bleed-marks render macro, registration-marks render macro, trim-marks render macro, registration-mark render macro

### Community 147 - "Community 166"
Cohesion: 0.67
Nodes (3): NavigationBuilder service, Eleventy Services README, TailwindLogger service

### Community 161 - "Community 179"
Cohesion: 0.67
Nodes (3): Gel atom (gel.njk), Video Atom, Sizzle Background Molecule

### Community 162 - "Community 180"
Cohesion: 0.67
Nodes (3): ink-marks render macro, colors render macro, neutrals render macro

### Community 163 - "Community 181"
Cohesion: 0.67
Nodes (3): Organizations component, Project Details component, Roles component

## Ambiguous Edges - Review These
- `serializePortableTextToHtml()` → `Lightbox`  [AMBIGUOUS]
  data/sanity/transforms/portableText.md · relation: references
- `serializePortableTextToHtml()` → `Lightbox Molecule`  [AMBIGUOUS]
  data/sanity/transforms/portableText.md · relation: references
- `bio-motion/fade.js` → `bio-motion/reduced.js`  [AMBIGUOUS]
  js/choreography/molecules/bio-motion/fade.md · relation: conceptually_related_to
- `process.md` → `Organizations`  [AMBIGUOUS]
  views/organisms/section/process.md · relation: references
- `CMS Services README` → `Frontend Documentation Index`  [AMBIGUOUS]
  docs/README.docs.md · relation: conceptually_related_to
- `Blockframes Layouts (positioning algorithms)` → `Blockframes Templates (atomic design level 4)`  [AMBIGUOUS]
  js/displays/blockframes/layouts/README.layouts.md · relation: conceptually_related_to
- `OrganizationsTriggers` → `ProcessTriggers`  [AMBIGUOUS]
  js/choreography/organisms/process/ProcessTriggers.md · relation: conceptually_related_to
- `Image Card Molecule` → `Lightbox Molecule`  [AMBIGUOUS]
  views/molecules/lightbox/lightbox.md · relation: semantically_similar_to
- `Responsive choreography (gsap.matchMedia breakpoint timelines)` → `Gel mask auto-refresh (ResizeObserver)`  [AMBIGUOUS]
  js/choreography/managers/GelAnimationManager/GelAnimationManager.md · relation: conceptually_related_to

## Knowledge Gaps
- **657 isolated node(s):** `titleStyle`, `msgStyle`, `successStyle`, `infoStyle`, `errorStyle` (+652 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **139 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `serializePortableTextToHtml()` and `Lightbox`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `serializePortableTextToHtml()` and `Lightbox Molecule`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `bio-motion/fade.js` and `bio-motion/reduced.js`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `process.md` and `Organizations`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `CMS Services README` and `Frontend Documentation Index`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Blockframes Layouts (positioning algorithms)` and `Blockframes Templates (atomic design level 4)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `OrganizationsTriggers` and `ProcessTriggers`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._