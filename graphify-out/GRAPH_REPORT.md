# Graph Report - frontend  (2026-08-06)

## Corpus Check
- Large corpus: 845 files · ~674,445 words. Semantic extraction will be expensive (many Claude tokens). Consider running on a subfolder.

## Summary
- 2203 nodes · 3676 edges · 240 communities (160 shown, 80 thin omitted)
- Extraction: 96% EXTRACTED · 4% INFERRED · 0% AMBIGUOUS · INFERRED: 148 edges (avg confidence: 0.75)
- Token cost: 1,639,855 input · 0 output

## Community Hubs (Navigation)
- Sanity Client and Queries
- NPM Build Scripts
- Atom Motion Primitives
- Preloader System
- Eleventy Filters
- Choreography Config Contracts
- Reduced Motion and Card Motion
- Bio Motion Variants
- Build Pipeline Scripts
- AIX Docs and Agent Prompts
- GSAP Vendor Bundle (minified)
- Sanity to 11ty Collections
- Sanity Content Schemas
- NPM Dependencies
- Typography and Registry
- Ruler Display System
- Blockframes Canvas Animation
- Contact Form
- Section Controllers and Bus
- Blockframes Painter Templates
- GROQ Projections and Queries
- Taxonomy Projections
- Process Section
- Blockframes Builder
- Utils Package (Logger, Color, Math)
- Dev Dependencies
- Breakpoints and Motion Profiles
- Hero Motion Variants
- HomeHeader Role States
- GSAP Vendor Bundle (minified)
- Bio Section Controller
- AbstractSectionAnimations Base
- Gel Core
- Award Motion Variants
- GSAP Vendor Bundle (minified)
- Painter Organism Templates
- Environment Info Scripts
- Process Blockframes Motion
- Taxonomy Queries
- Blockframes Animator
- UI Components Loop
- LandingSequence and Arrangements
- Work Section
- GSAP Vendor Bundle (minified)
- CSS Build Script
- System Health Check
- AIX Prompt Modules
- Hero to Menu Seam
- Event Contracts and Managers
- GelAnimationManager API
- Printmarks and Section Atoms
- Hero Section
- Blockframes Core
- Choreography Build Script
- Motion Specs and Tokens
- Project Page Data Flow
- Architecture Entrypoint Docs
- Component Scaffold Script
- Static File Server
- Navigation Macros
- Preloader Boot Gating
- Page IA Route Frontmatter
- Tailwind Build Logger
- Choreography Contracts Config
- WorkHeader Collapse
- Gel Modules
- Package Metadata
- Package Keywords
- Preview Build Script
- Logger Style Tests
- Home Page Composition
- GlobalHeader Scroll Hide
- Awards Section
- Background Video
- Projects Alternate Grid
- Gel Manipulator
- Gel Mask
- GSAP Vendor Bundle (minified)
- CSS Architecture
- Animation Bus Tests
- Page Layouts
- Director Boot and Audit
- AnimationDirector API
- ProjectHeader Parallax
- Template Partials
- SessionManager State
- AnimationBus Emitter
- Grid Generator Script
- Gel Geometry
- Page Templates and Layouts
- BuildInfoManager
- ScrollEffectsCoordinator
- ScrollSmootherManager
- Effects Package
- Hero Events Tests
- Community 95
- Community 96
- Community 97
- Community 98
- Community 99
- Community 100
- Community 101
- Community 102
- Community 103
- Community 104
- Community 105
- Community 106
- Community 107
- Community 108
- Community 109
- Community 110
- Community 111
- Community 112
- Community 113
- Community 115
- Community 116
- Community 117
- Community 118
- Community 119
- Community 120
- Community 121
- Community 122
- Community 123
- Community 124
- Community 125
- Community 127
- Community 128
- Community 129
- Community 130
- Community 131
- Community 132
- Community 133
- Community 134
- Community 135
- Community 136
- Community 137
- Community 138
- Community 139
- Community 140
- Community 142
- Community 149
- Community 157
- Community 158
- Community 159
- Community 161
- Community 162
- Community 163
- Community 164
- Community 165
- Community 166
- Community 172
- Community 173
- Community 174
- Community 175
- Community 177
- Community 178
- Community 207
- Community 208
- Community 209
- Community 210
- Community 211
- Community 212
- Community 215
- Community 217
- Community 220
- Community 222
- Community 223
- Community 224
- Community 225
- Community 226
- Community 227
- Community 228
- Community 229
- Community 230
- Community 231
- Community 232
- Community 233
- Community 234
- Community 235
- Community 236
- Community 237
- Community 238
- Community 239

## God Nodes (most connected - your core abstractions)
1. `scripts` - 69 edges
2. `AbstractSection` - 34 edges
3. `motion` - 31 edges
4. `AnimationDirector` - 27 edges
5. `init()` - 26 edges
6. `TIMELINE_IDS` - 25 edges
7. `AbstractSectionAnimations` - 24 edges
8. `SELECTORS` - 21 edges
9. `home.njk` - 21 edges
10. `Gel` - 20 edges

## Surprising Connections (you probably didn't know these)
- `IA Frontmatter Schema` --semantically_similar_to--> `Eleventy Collections Manager README`  [INFERRED] [semantically similar]
  docs/ia/frontmatter.md → eleventy/collections/README.collections.md
- `serializePortableTextToHtml()` --references--> `Lightbox Molecule`  [AMBIGUOUS]
  data/sanity/transforms/portableText.js → views/molecules/lightbox/lightbox.md
- `Preloader controller` --shares_data_with--> `AnimationDirector`  [INFERRED]
  docs/preloader-integration-checklist.md → js/choreography/AnimationDirector.js
- `buildChoreography.js` --references--> `AnimationDirector`  [EXTRACTED]
  scripts/README.scripts.md → js/choreography/AnimationDirector.js
- `section registry` --references--> `AbstractSection`  [EXTRACTED]
  docs/director-initialization-sequence.md → js/choreography/system/AbstractSection.js

## Import Cycles
- 2-file cycle: `js/choreography/molecules/card-motion/card-motion.js -> js/choreography/molecules/card-motion/clip.js -> js/choreography/molecules/card-motion/card-motion.js`
- 2-file cycle: `js/choreography/molecules/card-motion/card-motion.js -> js/choreography/molecules/card-motion/throw.js -> js/choreography/molecules/card-motion/card-motion.js`

## Hyperedges (group relationships)
- **Choreography prompt module routing (decision → planning → implementation)** — copilot_prompts_choreographer, copilot_prompts_choreography_planning, copilot_prompts_choreography_implementation, copilot_prompts_index [EXTRACTED 1.00]
- **Sanity build-time data flow: client → queries → projections → collections** — data_sanity_client_index, data_sanity_queries, data_sanity_projections_readme, data_sanity_readme [EXTRACTED 1.00]
- **Choreography runtime: Director → Bus → AbstractSection → LandingSequence** — choreography_animationdirector_concept, choreography_animationbus_concept, choreography_abstractsection_concept, choreography_landingsequence_concept [EXTRACTED 1.00]
- **SKOS taxonomy concept queries sharing conceptProjection + factory** — data_sanity_queries_activity_activities, data_sanity_queries_industry_industries, data_sanity_queries_outcome_outcomes, data_sanity_projections_taxonomy_conceptprojection, data_sanity_queries_skos_concept [EXTRACTED 1.00]
- **Project query/projection family (card, page, landing)** — data_sanity_projections_project_projectcardprojection, data_sanity_projections_project_projectpageprojection, data_sanity_projections_project_projectslandingprojection, data_sanity_queries_project_project_pages [INFERRED 0.85]
- **Query files referencing named projections per README pattern** — data_sanity_queries_readme_queries, data_sanity_queries_organization_organizations, data_sanity_projections_organization_organizationprojection, data_sanity_queries_post_posts, data_sanity_projections_post_postprojection [EXTRACTED 1.00]
- **CMS build-time fetch/cache/collection pipeline** — data_sanity_services_sanityservice_init, data_sanity_services_fetchsanitydata_fetchsanitydata, data_sanity_services_index_init [EXTRACTED 1.00]
- **Award record build + inline SVG hydration** — data_sanity_transforms_award_buildawardcardrecord, data_sanity_transforms_award_hydrateawardinlinelogos, data_sanity_transforms_award_fetchsvgmarkup, data_sanity_transforms_award_normalizeawardrecords [EXTRACTED 1.00]
- **Shared project card URL resolution across queries/transforms** — data_sanity_transforms_project_resolveprojectcardurl, data_sanity_transforms_home_normalizelandingrecords, data_sanity_queries_project_projects_projectsquery, data_sanity_queries_project_projects_by_industry_projectsbyindustryquery [INFERRED 0.85]
- **Choreography boot sequence participants** — js_choreography_animationdirector_animationdirector, js_choreography_system_animationbus_animationbus, js_choreography_templates_landing_landingsequence_landingsequence, js_choreography_system_registry_registry, js_preloader_preloader_preloader [EXTRACTED 1.00]
- **Sanity CMS to 11ty content pipeline** — data_sanity_client_client, data_sanity_fetchsanitydata_fetchsanitydata, data_sanity_queries_queries, eleventy_collections_sanity_sanity, views_layouts_case_study_case_study [EXTRACTED 1.00]
- **Frontend AIX documentation entrypoint set** — docs_ai_readme_ai, docs_ai_start_here, docs_ai_workspace_portability, docs_ai_aix_maintenance, docs_ai_aix_maintenance_checklist [EXTRACTED 1.00]
- **Filter modules registered through the filters barrel** — eleventy_filters_filters, eleventy_filters_array, eleventy_filters_color, eleventy_filters_date, eleventy_filters_dom, eleventy_filters_file, eleventy_filters_image, eleventy_filters_string [EXTRACTED 1.00]
- **IA route files share the eleventyComputed + CMS-collection binding pattern** — ia_index, ia_project, ia_projects, ia_user_guide [INFERRED 0.75]
- **Collections / Services / Templates separation-of-concerns layering** — eleventy_services_readme_services, eleventy_services_navigationbuilder, eleventy_services_tailwindlogger [EXTRACTED 1.00]
- **Atomic Design Documentation Tiers** — ia_docs_design_atoms_readme, ia_docs_design_molecules_readme, ia_docs_design_organisms_readme, ia_docs_design_templates_readme, ia_docs_design_layouts_readme [EXTRACTED 1.00]
- **Sanity Content Document Layer** — ia_docs_content_strategy_schemas_project, ia_docs_content_strategy_schemas_post, ia_docs_content_strategy_schemas_award, ia_docs_content_strategy_schemas_organization, ia_docs_content_strategy_schemas_insight [EXTRACTED 1.00]
- **Homepage Section Rendering via Njk Macros** — ia_docs_design_organisms_section_awards_readme, ia_docs_design_organisms_section_bio_readme, ia_docs_design_organisms_readme [INFERRED 0.85]
- **Choreography boot-sequence documentation set** — js_choreography_animationdirector, js_choreography_readme_choreography, js_choreography_getting_started, js_choreography__context_audit [INFERRED 0.85]
- **Atomic motion primitives layer (atoms)** — js_choreography_atoms_index, js_choreography_atoms_fade_fade, js_choreography_atoms_slide_slide, js_choreography_atoms_scale_scale, js_choreography_atoms_clip_reveal_clip_reveal, js_choreography_atoms_stagger_reveal_stagger_reveal, js_choreography_atoms_text_split_reveal_text_split_reveal, js_choreography_atoms_parallax_parallax [EXTRACTED 1.00]
- **Choreography config contracts vocabulary** — js_choreography_config_contracts_events_events, js_choreography_config_contracts_labels_labels, js_choreography_config_contracts_paths_paths, js_choreography_config_contracts_selectors_selectors [EXTRACTED 1.00]
- **Scroll Effects Stage (ScrollEffectsCoordinator + Sub-managers)** — js_choreography_animationdirector_animationdirector, js_choreography_managers_scrolleffectscoordinator_scrolleffectscoordinator, js_choreography_managers_reducedmotionhandler_reducedmotionhandler, js_choreography_managers_scrollsmoothermanager_scrollsmoothermanager, js_choreography_managers_gelanimationmanager_gelanimationmanager [EXTRACTED 1.00]
- **Work Section Navigation & Pin Coordination** — js_choreography_managers_workheadermanager_workheadermanager, js_choreography_managers_worknavmanager_worknavmanager, js_choreography_organisms_card_cardmanager_cardmanager, js_choreography_animationdirector_animationdirector [EXTRACTED 1.00]
- **Choreography Config Barrel Composition** — js_choreography_config_index_index, js_choreography_config_ix_ix, js_choreography_config_displays_displays, js_choreography_config_contracts_timelines_timelines [EXTRACTED 1.00]
- **Reduced-motion variant-swap pattern across sections** — js_choreography_molecules_award_motion_reduced, js_choreography_molecules_bio_motion_reduced, js_choreography_molecules_hero_motion_simple, js_choreography_config_ix_profiles [INFERRED 0.85]
- **Bio gel-band synchronization system (heading + overview gels, never pinned)** — js_choreography_molecules_bio_motion_heading_gel, js_choreography_molecules_bio_motion_overview_gel, js_choreography_organisms_bio_biotriggers, js_choreography_managers_gelanimationmanager [EXTRACTED 1.00]
- **Process Blockframes grid fill + staggered reveal pipeline** — js_choreography_molecules_process_motion_blockframes_grid, js_choreography_molecules_process_motion_blockframes, js_displays_blockframes_builder, js_choreography_molecules_process_motion_reveal [EXTRACTED 1.00]
- **Fixed-container gel scroll-sync pattern (process + bio)** — js_choreography_molecules_process_motion_section_gel, js_choreography_molecules_bio_motion_heading_gel, js_choreography_molecules_process_motion_section_gel_attachsectiongel [INFERRED 0.90]
- **Unscrubbed lifecycle-driven reveal fallback (Awards/Bio/Hero triggers)** — js_choreography_organisms_awards_awardstriggers_bind, js_choreography_organisms_bio_biotriggers_bind, js_choreography_organisms_hero_herotriggers_bind, js_choreography_system_abstractsection_playintro [INFERRED 0.90]
- **Process section variant composition (process-motion + reveal + gel + ui-loop)** — js_choreography_molecules_process_motion_process_motion, js_choreography_molecules_process_motion_reveal, js_choreography_molecules_process_motion_section_gel, js_choreography_molecules_process_motion_ui_components_loop [EXTRACTED 1.00]
- **AbstractSection four-phase lifecycle contract** — js_choreography_system_abstractsection, js_choreography_system_abstractsectionanimations, js_choreography_system_abstractsectiontriggers, js_choreography_system_promiseresolverqueue [EXTRACTED 0.90]
- **Section controller / animations / triggers triad pattern** — js_choreography_organisms_organizations_organizations, js_choreography_organisms_organizations_organizationsanimations, js_choreography_organisms_organizations_organizationstriggers, js_choreography_organisms_process_process, js_choreography_organisms_process_processanimations, js_choreography_organisms_process_processtriggers, js_choreography_organisms_work_work, js_choreography_organisms_work_workanimations, js_choreography_organisms_work_worktriggers [INFERRED 0.85]
- **system/index barrel re-exporting all runtime infrastructure** — js_choreography_system_index, js_choreography_system_animationbus, js_choreography_system_nullanimationbus, js_choreography_system_abstractsection, js_choreography_system_registry [EXTRACTED 0.90]
- **Blockframes atomic-design paint pipeline (atoms→molecules→organisms→templates)** — js_displays_blockframes_atoms_readme_atoms_atoms, js_displays_blockframes_molecules_readme_molecules_molecules, js_displays_blockframes_organisms_readme_organisms_organisms, js_displays_blockframes_templates_readme_templates_templates, js_displays_blockframes_painter_painter [EXTRACTED 0.95]
- **Gel liquid-effect rendering pipeline (geometry→manipulator→mask→visual state)** — js_effects_gel_gelgeometry_gelgeometry, js_effects_gel_gelmanipulator_gelmanipulator, js_effects_gel_gelmask_gelmask, js_effects_gel_gelvisualstate_gelvisualstate, js_effects_gel_gel_gel [EXTRACTED 0.90]
- **Frontend production build pipeline (design→css→js→ 11ty)** — scripts_fetchfigma_fetchfigma, scripts_buildcss_buildcss, scripts_buildchoreography_buildchoreography, build_order_rationale [EXTRACTED 0.95]
- **Gel Arrangement System (Landing Sections)** — specs_animation_section_gel_arrangements_animation_spec, specs_animation_awards_gel_intro_outro_animation_spec, js_choreography_managers_gelanimationmanager_gelanimationmanager, js_choreography_templates_landing_landingsequence, js_choreography_organisms_hero_heroanimations [EXTRACTED 1.00]
- **Breakpoint & Reduced-Motion Governance** — specs_animation_breakpoint_motion_profiles_animation_spec, specs_animation_motion_accessibility_policy, specs_animation_choreographer_animation_spec, js_choreography_config_ix_motion_motion, js_choreography_system_abstractsection [INFERRED 0.85]
- **Home Page Sanity-to-Template Pipeline** — data_sanity_queries_home, data_sanity_transforms_home, eleventy_collections_sanity, ia_index, views_pages_home_home [EXTRACTED 1.00]
- **Atomic Design Atom Layer Components** — views_atoms_avatar, views_atoms_award, views_atoms_cta, views_atoms_field, views_atoms_gel, views_atoms_heading, views_atoms_icon, views_atoms_input, views_atoms_organization, views_atoms_project, views_atoms_ruler, views_atoms_textformat, views_atoms_button_button [EXTRACTED 1.00]
- **Figma-to-Tailwind Typography Build Pipeline** — figma_services_typographyservice, styles_typography_imports_css, styles_typography_fontfamilies_css [EXTRACTED 1.00]
- **Component Registry Documentation Pattern** — views__registry__registry, views_atoms_icon, views_atoms_button_button [EXTRACTED 1.00]
- **Base layout shell composition** — views_layouts_base_base, views_organisms_header_global_header, views_organisms_footer_global_footer, views_organisms_navigation_skip_links_nav, views_templates_partials_head [EXTRACTED 0.90]
- **Print marks atom family** — views_atoms_printmarks_ink_marks_render, views_atoms_printmarks_margin_bleed_marks_render, views_atoms_printmarks_registration_marks_render, views_atoms_printmarks_trim_marks_render [INFERRED 0.75]
- **UI components loop choreography contract** — views_atoms_svg_ui_components_loop_render, js_choreography_molecules_process_motion_ui_components_loop, specs_animation_ui_components_animation_spec, data_process_el_uicomponents [EXTRACTED 0.90]
- **Sanity Card View-Model Normalization** — views_molecules_card_card, views_molecules_card_project, views_molecules_card_organization, views_molecules_card_award, eleventy_collections_sanity [EXTRACTED 0.90]
- **Printmarks Macro Composition** — views_molecules_printmarks, views_atoms_printmarks_ink_marks, views_atoms_printmarks_trim_marks, views_atoms_printmarks_margin_bleed_marks, views_atoms_printmarks_registration_marks [EXTRACTED 0.85]
- **Section Cap Scroll Context Managers** — views_molecules_section_cap, js_choreography_organisms_bio_buildinfomanager, js_choreography_organisms_homeheadermanager, js_choreography_organisms_worknavmanager [EXTRACTED 0.85]
- **Home header loader/hero/menu role state machine** — views_organisms_header_home_home_landing_home_landing, views_organisms_navigation_page_nav_render, js_choreography_managers_homeheadermanager_homeheadermanager [EXTRACTED 0.90]
- **Project page header assembly** — views_organisms_header_project_project_header_render, views_molecules_project_metadata_project_metadata_render, views_molecules_list_project_orgs_render, views_organisms_navigation_breadcrumbs_nav_render [EXTRACTED 0.90]
- **Site-wide footer composition** — views_organisms_footer_global_footer_render, views_molecules_list_main_pages_render [EXTRACTED 0.85]
- **Home page composes homepage organism sections** — views_pages_home_home, views_organisms_section_bio, views_organisms_section_work, views_organisms_section_organizations, views_organisms_section_awards, views_organisms_section_contact [EXTRACTED 1.00]
- **Sanity-to-template data pipeline for project page** — ia_project, data_sanity_queries_project_project_pages, data_sanity_projections_project_projectpageprojection, data_sanity_transforms_project, views_pages_project_project [EXTRACTED 1.00]
- **Two-channel developer narrative (console + HTML comments)** — views_templates_partials_dev_note, views_pages_home_home, aix_docs_decisions_0005_dev_channel_narrative [EXTRACTED 1.00]

## Communities (240 total, 80 thin omitted)

### Community 0 - "Sanity Client and Queries"
Cohesion: 0.06
Nodes (61): clean(), createSanityClient(), errorStyle, infoStyle, resolveSanityConfig(), sanitizeConfigForLogs(), CMS_QUERIES, projectsByIndustryQuery (+53 more)

### Community 1 - "NPM Build Scripts"
Cohesion: 0.03
Nodes (69): scripts, build, build:11ty, build:css, build:css:dev, build:debug, build:design, build:design:debug (+61 more)

### Community 2 - "Atom Motion Primitives"
Cohesion: 0.06
Nodes (34): CLIP_HIDDEN, clipRevealIn(), clipRevealOut(), fadeIn(), fadeOut(), scaleCollapse(), scaleReveal(), slideIn() (+26 more)

### Community 3 - "Preloader System"
Cohesion: 0.07
Nodes (51): animateExit(), animateIntro(), once(), PRELOADER_ANIMATION, PRELOADER_ANIMATION_MESSAGES, PRELOADER_ASSET, PRELOADER_ATTRIBUTES, PRELOADER_CONTROLLER_MESSAGES (+43 more)

### Community 4 - "Eleventy Filters"
Cohesion: 0.05
Nodes (23): NOTE: Works with both single values and array values (uses first item), hexToRgb(), multiplyBlend(), rgbToHex(), NOTE: Works with both JavaScript Date objects and ISO 8601 date strings., extractHeadings (TOC data source), injectSvgClass(), mergeClasses() (+15 more)

### Community 5 - "Choreography Config Contracts"
Cohesion: 0.10
Nodes (19): SELECTORS, TIMELINE_IDS, TODO: The complexity of the choreography has grown past what a simple, BACKGROUND_TRIGGER, ORGANIZATIONS_TRIGGER, SCROLL_DEFAULTS, NOTE: This might be better defined along with the other factory methods in AWARD, AWARDS_TRIGGER (+11 more)

### Community 6 - "Reduced Motion and Card Motion"
Cohesion: 0.07
Nodes (30): Card Dealt/Flicked Fish-River Metaphor, ReducedMotionHandler manager, isReducedMotion(), ReducedMotionHandler, CLEAR, killST(), createCardScrollClip(), createInterTimeline() (+22 more)

### Community 7 - "Bio Motion Variants"
Cohesion: 0.07
Nodes (42): BIO_SELECTORS, BIO_INTRO, BIO_OUTRO, BIO_VARIANT_FACTORIES, createFadeIn(), createFadeOut(), Bio fade variant currently inert (commented out), initFade() (+34 more)

### Community 8 - "Build Pipeline Scripts"
Cohesion: 0.06
Nodes (44): Frontend build order (clean→design→css→js→ 11ty), buildChoreography.js, buildCollection(), directoryToProcess, fs, outputFile, path, readDirectoryStructure() (+36 more)

### Community 9 - "AIX Docs and Agent Prompts"
Cohesion: 0.08
Nodes (24): AIX context hygiene principle, LCP asset + font preload strategy, Link, don't fork (AI docs portability), Reduced-motion graceful degradation, AIX Maintenance Loop (frontend), AIX Maintenance Checklist (Copilot-First Repos), Canonical choreography patterns, Canonical JS initialization patterns (+16 more)

### Community 10 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.06
Nodes (18): fe(), ga(), Kd(), Ld(), ma(), Md(), na(), Nd() (+10 more)

### Community 11 - "Sanity to 11ty Collections"
Cohesion: 0.08
Nodes (31): Collection initialization dependency order (Sanity before Navigation), Eleventy service layer pattern, Sanity client.js, fetchSanityData.js, projects.js query projection, data/sanity/queries.js, Sanity to 11ty data flow, __dirname (+23 more)

### Community 12 - "Sanity Content Schemas"
Cohesion: 0.08
Nodes (40): Content Graph, Content Strategy Docs, Content Schemas, Activity Taxonomy, AWARD Schema, IMAGE_ASSET Schema, ImageMeta Object, Industry Taxonomy (+32 more)

### Community 13 - "NPM Dependencies"
Cohesion: 0.05
Nodes (39): @11ty/eleventy, @11ty/eleventy-fetch, @11ty/eleventy-img, @11ty/eleventy-navigation, cheerio, @datainkio/lumberjack, @datainkio/textparty, dotenv (+31 more)

### Community 14 - "Typography and Registry"
Cohesion: 0.07
Nodes (31): TypographyService.js, Typography Font Loading Order, fontFamilies.css (auto-generated), imports.css, Typography System Architecture README, Component Registry (_registry.njk), registry macro: button, registry macro: component (+23 more)

### Community 15 - "Ruler Display System"
Cohesion: 0.09
Nodes (18): RULER_DEFAULTS, RULER_INTRO_DEFAULTS, choreography/config/ruler.js, RulerIntroManager, initRulerIntro(), RulerIntroManager, CompositeDisplay, DisplayManager (+10 more)

### Community 16 - "Blockframes Canvas Animation"
Cohesion: 0.10
Nodes (4): AnimationManager, CanvasManager, Halftone, HalftoneEffect

### Community 17 - "Contact Form"
Cohesion: 0.11
Nodes (10): contactSubmission schema, ContactForm, LIMITS, MESSAGES, sanitize(), Lightbox, Progressive enhancement (no-JS fallback) pattern, Contact Form 11ty/Sanity Serverless Email Spec (+2 more)

### Community 18 - "Section Controllers and Bus"
Cohesion: 0.09
Nodes (12): BackgroundVideo (section controller), Organizations, GlobalHeaderManager, NullAnimationBus, PromiseResolverQueue, ReducedMotionHandler, getSectionIds(), getSectionName() (+4 more)

### Community 19 - "Blockframes Painter Templates"
Cohesion: 0.12
Nodes (15): article(), basic(), block(), blog(), calendar(), cart(), chart(), contact() (+7 more)

### Community 20 - "GROQ Projections and Queries"
Cohesion: 0.14
Nodes (10): POST_REF_PROJECTION, PROJECT_CARD_PROJECTION, USER_GUIDE_PROJECTION, CMS_QUERIES, homeQuery, imageAssetsQuery, navigationQuery, organizationsQuery (+2 more)

### Community 21 - "Taxonomy Projections"
Cohesion: 0.22
Nodes (10): ACTIVITY_PROJECTION, AWARD_PROJECTION, FEATURED_IMAGE_PROJECTION, ORGANIZATION_PROJECTION, OUTCOME_PROJECTION, PAGE_PROJECTION, Sanity Projections reference, ROLE_PROJECTION (+2 more)

### Community 22 - "Process Section"
Cohesion: 0.13
Nodes (7): Process, ProcessAnimations, ProcessTriggers, AnimationDirector, GelAnimationManager, process-motion/blockframes.js, process-motion (PROCESS_VARIANT_FACTORIES)

### Community 23 - "Blockframes Builder"
Cohesion: 0.12
Nodes (5): Builder, BlockLine, Cloud layout, Grid layout, Blockframes Layouts (positioning algorithms)

### Community 24 - "Utils Package (Logger, Color, Math)"
Cohesion: 0.11
Nodes (15): preloader logger, assetPath (getAssetPath/getImagePath/getVideoPath), ColorSpace, ThemeColors (color), MemoryProfiler, ScrollBlockedDiagnostic, Logger (utils, singleton), LoggerStyle (+7 more)

### Community 25 - "Dev Dependencies"
Cohesion: 0.11
Nodes (19): ansi-colors, djlint, esbuild, glob, html-minifier, npm-run-all, devDependencies, ansi-colors (+11 more)

### Community 26 - "Breakpoints and Motion Profiles"
Cohesion: 0.15
Nodes (16): Motion Profile Resolution Layer, BREAKPOINT_MATCH_MEDIA_CONDITIONS, BREAKPOINT_PRIORITY, getActiveBreakpoint(), TAILWIND_BREAKPOINTS, ACCESSIBILITY_SETTINGS, CARD_STATIC, getActiveMotionProfileKey() (+8 more)

### Community 27 - "Hero Motion Variants"
Cohesion: 0.19
Nodes (14): HERO_SELECTORS, HERO_INTRO, HERO_LANDING, HERO_VARIANT_FACTORIES, createLowerShutter(), createRaiseShutter(), init(), revertSplit() (+6 more)

### Community 29 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.14
Nodes (18): classes(), ab(), bc(), eb(), Eo(), fb(), ib(), mb() (+10 more)

### Community 31 - "AbstractSectionAnimations Base"
Cohesion: 0.15
Nodes (3): AbstractSectionAnimations, EMPTY_TIMELINES(), TIMELINE_BUILDERS

### Community 33 - "Award Motion Variants"
Cohesion: 0.21
Nodes (12): AWARD_SELECTORS, AWARDS_INTRO, AWARD_VARIANT_FACTORIES, buildIntro(), buildOutro(), init(), Reduced-motion variant-swap contract (Awards), createSlideIn() (+4 more)

### Community 34 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.17
Nodes (17): ae(), Animation(), Ba(), ce(), ea(), fa(), ia(), ja() (+9 more)

### Community 36 - "Environment Info Scripts"
Cohesion: 0.22
Nodes (10): display11tyInfo(), getEleventyVersion(), displayEnvironmentInfo(), main(), __dirname, displayTailwindInfo(), main(), init11ty() (+2 more)

### Community 37 - "Process Blockframes Motion"
Cohesion: 0.22
Nodes (11): ui components anim.svg, PROCESS_SELECTORS, buildBlockframesReveal(), Non-literal dynamic import to keep blockframes package out of bundle, buildBlockframesReveal, fillBlockframesGrid, intro(), attachSectionGel() (+3 more)

### Community 38 - "Taxonomy Queries"
Cohesion: 0.22
Nodes (8): INDUSTRY_PROJECTION, CONCEPT_PROJECTION, activitiesQuery, industriesQuery, outcomesQuery, rolesQuery, skos-concept factory, makeSkosConceptQuery()

### Community 39 - "Blockframes Animator"
Cohesion: 0.16
Nodes (4): fillBlockframesGrid(), tokenColor(), Animator, Blockframes

### Community 40 - "UI Components Loop"
Cohesion: 0.27
Nodes (12): data-process-el=uicomponents hook family, PROCESS_VARIANT_FACTORIES, buildUiComponentsLoop(), buildUiComponentsReduced(), fadeOpacity(), intro(), introReduced(), measure() (+4 more)

### Community 41 - "LandingSequence and Arrangements"
Cohesion: 0.20
Nodes (4): Viewport-Normalized Gel Arrangement Schema, config/arrangements.js, LandingSequence, Section Gel Arrangements Spec (MVP)

### Community 42 - "Work Section"
Cohesion: 0.16
Nodes (3): Work, selectWorkEl(), WorkAnimations

### Community 43 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.18
Nodes (14): Aa(), Bb(), Cb(), Context(), db(), Fc(), gb(), Gc() (+6 more)

### Community 44 - "CSS Build Script"
Cohesion: 0.21
Nodes (12): buildCSS(), buildCSS.js sidecar, __dirname, errorStyle, __filename, main(), parseTailwindOutput(), projectRoot (+4 more)

### Community 45 - "System Health Check"
Cohesion: 0.26
Nodes (13): checkBuildTools(), checkDependencies(), checkEnvironmentVariables(), checkFileSystem(), checkNodeEnvironment(), __dirname, __filename, generateHealthReport() (+5 more)

### Community 46 - "AIX Prompt Modules"
Cohesion: 0.33
Nodes (13): AIX Manifest (Concierge template), config/contracts/events.js (event contracts), config/index.js (choreography config barrel), Frontend Claude Code Entrypoint, Choreographer Prompt (GSAP vs Tailwind), Choreography Implementation Prompt, Choreography Planning Prompt, HTML & Template Maintenance Prompt (+5 more)

### Community 47 - "Hero to Menu Seam"
Cohesion: 0.17
Nodes (12): Time-Driven Hero-to-Menu Seam Pattern, HOME_HERO_BUILD, HOME_HERO_HOLD, HOME_HERO_OUTRO, HOME_NAV_REVEAL, parseCssSeconds(), SEAM_TOKENS, Home Header Hero→Menu Transition Spec (+4 more)

### Community 48 - "Event Contracts and Managers"
Cohesion: 0.26
Nodes (7): EVENTS, GlobalHeaderManager, ProjectHeaderManager, ScrollEffectsCoordinator, ScrollSmootherManager, SessionManager, MEDIA

### Community 50 - "Printmarks and Section Atoms"
Cohesion: 0.15
Nodes (13): BuildInfoManager.js, HomeHeaderManager.js, WorkNavManager.js, Organization atom (organization.njk), Ink Marks Atom, Margin Bleed Marks Atom, Registration Marks Atom, Trim Marks Atom (+5 more)

### Community 52 - "Blockframes Core"
Cohesion: 0.22
Nodes (7): IMPORTANT: Builder.js handles the actual insertion logic. See Builder.js, build(), buildings(), drawFace(), drawStory(), roof(), scaleFace()

### Community 53 - "Choreography Build Script"
Cohesion: 0.15
Nodes (11): args, buildOptions, cliForcesBundle, __dirname, entryPoint, envBundlePreference, __filename, outDir (+3 more)

### Community 54 - "Motion Specs and Tokens"
Cohesion: 0.26
Nodes (12): Two-Gel Backing Composition Pattern, GSAP vs Tailwind Decision Rubric, arrangements.js (displays config), config/motion.js (token source of truth), tailwind.motion.config.cjs, Reduced-Motion Default Strategy Mapping, Awards Gel Intro/Outro Spec, Choreographer Module Spec (+4 more)

### Community 55 - "Project Page Data Flow"
Cohesion: 0.18
Nodes (11): backend project.ts schema, PROJECT_PAGE_PROJECTION, projectPagesQuery, Project Page Sanity-to-Template Data Flow, card.views-spec.md, Home Page Template Spec, Home Page Sanity-to-Template Data Flow, Single Project Page Template Spec (+3 more)

### Community 56 - "Architecture Entrypoint Docs"
Cohesion: 0.29
Nodes (12): AbstractSection base class, AnimationBus (pub/sub), AnimationDirector (master coordinator), config/contracts/selectors/selectors.js, GSAP plugin registration (system/gsap.js), LandingSequence, CMS Integration README (data/sanity), Build pipeline (clean → build:design → build:css → build:js → build:11ty) (+4 more)

### Community 57 - "Component Scaffold Script"
Cohesion: 0.26
Nodes (11): __dirname, __filename, generateComponent(), generateSection(), listComponents(), main(), projectRoot, sectionTemplates (+3 more)

### Community 58 - "Static File Server"
Cohesion: 0.17
Nodes (9): args, COMPRESSIBLE, __dirname, __filename, MIME, PORT, projectRoot, ROOT (+1 more)

### Community 59 - "Navigation Macros"
Cohesion: 0.18
Nodes (12): hanko render macro, Icon component, nav-link render macro, site-title render macro, Child Pages component, Main Pages render macro, Global Footer render macro, Article Header render macro (+4 more)

### Community 60 - "Preloader Boot Gating"
Cohesion: 0.18
Nodes (11): Choreography boot gating (director:ready -> preloader:out -> LandingSequence), AnimationDirector Initialization Sequence, AnimationDirector Initialization Sequence (PDF), Preloader Integration Checklist, Storyboards README, GSAP local-copy detection for ScrollSmoother compatibility, preloader animations, preloader constants (+3 more)

### Community 61 - "Page IA Route Frontmatter"
Cohesion: 0.22
Nodes (11): content-model project-page pattern, Home page IA (route frontmatter), Project page IA (route frontmatter, paginated), Case Studies landing IA (route frontmatter), User Guide IA (route frontmatter), ProjectOrgs.render macro, Project Metadata Band render macro, Stats.render macro (+3 more)

### Community 63 - "Choreography Contracts Config"
Cohesion: 0.31
Nodes (6): LABELS, ASSET_PATHS, Choreography Contracts README, BUILD_INFO_SELECTORS, Choreography Config Package README, BuildInfo.render macro

### Community 64 - "WorkHeader Collapse"
Cohesion: 0.36
Nodes (3): WorkHeaderManager, mq, reducedMotionHandler

### Community 65 - "Gel Modules"
Cohesion: 0.25
Nodes (3): DEFAULT_COLOR_CLASSES, MASK_STYLE, GelVisualState

### Community 66 - "Package Metadata"
Cohesion: 0.18
Nodes (10): bugs, url, description, homepage, license, name, packageManager, private (+2 more)

### Community 67 - "Package Keywords"
Cohesion: 0.18
Nodes (11): keywords, 11ty, cms, design-system, eleventy, figma-integration, jamstack, portfolio (+3 more)

### Community 68 - "Preview Build Script"
Cohesion: 0.24
Nodes (10): args, __dirname, __filename, isDev, isVerbose, main(), projectRoot, showDesignSystemSync() (+2 more)

### Community 69 - "Logger Style Tests"
Cohesion: 0.18
Nodes (10): blueStyle, customSuccess, cyanStyle, debugData, debugStyle, infoStyle, orangeStyle, pinkStyle (+2 more)

### Community 70 - "Home Page Composition"
Cohesion: 0.24
Nodes (10): ADR 0005 dev-channel narrative, contactSubmission schema, contact form spec, Gel atom (gel.njk), Video Atom, Sizzle Background Molecule, global-footer organism, Contact (+2 more)

### Community 71 - "GlobalHeader Scroll Hide"
Cohesion: 0.29
Nodes (3): GlobalHeaderManager, mq, reducedMotionHandler

### Community 74 - "Projects Alternate Grid"
Cohesion: 0.44
Nodes (9): project(), applyAlternatingStyles(), clearCards(), init(), navigate_projects(), onMouseOut(), onMouseOver(), showSelected() (+1 more)

### Community 77 - "GSAP Vendor Bundle (minified)"
Cohesion: 0.27
Nodes (10): _assertThisInitialized(), hc(), ra(), Timeline(), Tween(), va(), w(), wa() (+2 more)

### Community 78 - "CSS Architecture"
Cohesion: 0.20
Nodes (10): base.css, colors.css, decorations.css, CSS Import Cascade Order Principle, main.css, CSS Architecture README, TailwindLogger service, typography/fontFamilies.css (+2 more)

### Community 79 - "Animation Bus Tests"
Cohesion: 0.20
Nodes (7): abstractLifecycleHooks, __dirname, __filename, listenerMatches, registryMatch, requiredBusApiMarkers, sectionIds

### Community 80 - "Page Layouts"
Cohesion: 0.24
Nodes (9): base layout, cols-2-after layout, Cols 2 Before Layout, cols-2-before layout, Cols 3 Layout, global-header organism, breadcrumbs-nav organism, docs-nav organism (+1 more)

### Community 81 - "Director Boot and Audit"
Cohesion: 0.31
Nodes (8): Choreography Package Code Review (audit.md), Choreography Atomic Design Architecture Prompt, initDirector(), LOGS, scheduleInit(), Getting Started with Choreography, Choreography System README, JS Modules Overview (README.js.md)

### Community 82 - "AnimationDirector API"
Cohesion: 0.22
Nodes (3): AnimationDirector, Animation Manager Modules (README), section registry

### Community 83 - "ProjectHeader Parallax"
Cohesion: 0.28
Nodes (4): parallaxScrub(), PROJECT_HEADER_SELECTORS, PROJECT_HEADER_ANIMATION, ProjectHeaderManager

### Community 84 - "Template Partials"
Cohesion: 0.28
Nodes (9): choreography/Director.js, Organisms Directory README, Choreography Script partial, Fonts partial, gtm-noscript partial, GTM Script partial, head partial, Robots partial (+1 more)

### Community 87 - "Grid Generator Script"
Cohesion: 0.39
Nodes (7): drawCircle(), drawGrid(), drawOppositeCircles(), generateLittleBlock(), generateNewGrid(), getTwoColors(), init()

### Community 89 - "Page Templates and Layouts"
Cohesion: 0.22
Nodes (9): hanko atom, base layout, project-cards molecule, Hero, README.section (organisms/section), Projects page, Blog layout, Case Study layout (+1 more)

### Community 93 - "Effects Package"
Cohesion: 0.25
Nodes (8): HalftoneFilter, ParallaxLayer, Effects Package (text, transitions, gel, halftone, parallax), SplitText wrapper, TextParty, TransitionManager, AccessibilityAuditor, prefers-reduced-motion accessibility pattern

### Community 94 - "Hero Events Tests"
Cohesion: 0.25
Nodes (7): abstractSectionPath, __dirname, eventsPath, __filename, heroPath, missing, requiredMarkers

### Community 95 - "Community 95"
Cohesion: 0.38
Nodes (7): Atomic Design Pattern (atoms→molecules→organisms→templates), Blockframes Atoms (atomic design level 1), Blockframes Molecules (atomic design level 2), Blockframes Organisms (atomic design level 3), Painter, Blockframes System Architecture Doc, Blockframes Templates (atomic design level 4)

### Community 96 - "Community 96"
Cohesion: 0.29
Nodes (6): errorStyle, metricStyle, processStyle, successStyle, titleStyle, warningStyle

### Community 97 - "Community 97"
Cohesion: 0.29
Nodes (6): buildLogger, figmaLogger, logger1, logger2, navigationLogger, tailwindLogger

### Community 98 - "Community 98"
Cohesion: 0.29
Nodes (6): error1, error2, error3, error4, error5, obj

### Community 100 - "Community 100"
Cohesion: 0.33
Nodes (6): WorkHeaderManager, WorkHeaderManager, Work Section Navigation Spec, projects-by-industry molecule, work.njk, Sticky Local Nav with Scrollspy Pattern

### Community 103 - "Community 103"
Cohesion: 0.33
Nodes (5): buildLogger, deploymentLogger, figmaService, navigationService, sanityService

### Community 104 - "Community 104"
Cohesion: 0.33
Nodes (5): basicBuildSequence, customStyle, designSyncSequence, devWorkflowSequence, productionSequence

### Community 106 - "Community 106"
Cohesion: 0.40
Nodes (4): args, dirIndex, EXCLUDE_PATTERNS, files

### Community 107 - "Community 107"
Cohesion: 0.50
Nodes (4): assets/svg/blockframes.svg, blockframes.js, blockframe-basic render macro, bio.njk (Bio organism)

### Community 111 - "Community 111"
Cohesion: 0.67
Nodes (3): handleLinkClick(), TL, README.pages (Page Animations)

### Community 113 - "Community 113"
Cohesion: 0.50
Nodes (4): Logger utility (js/utils/logger/index.js), Logger Test Suite README, Lumberjack Browser Mode Test, Test Suite README

### Community 115 - "Community 115"
Cohesion: 0.50
Nodes (4): ha(), Kc(), Mc(), Tb()

### Community 116 - "Community 116"
Cohesion: 0.50
Nodes (4): author, email, name, url

### Community 117 - "Community 117"
Cohesion: 0.83
Nodes (3): hexToRgb(), multiplyBlend(), rgbToHex()

### Community 118 - "Community 118"
Cohesion: 1.00
Nodes (3): execGit(), main(), tryExecGit()

### Community 119 - "Community 119"
Cohesion: 0.50
Nodes (3): airtableStyle, cachingStyle, processingStyle

### Community 120 - "Community 120"
Cohesion: 0.50
Nodes (3): __dirname, __filename, tests

### Community 121 - "Community 121"
Cohesion: 0.50
Nodes (3): buildLogger, customLogger, scopedLogger

### Community 122 - "Community 122"
Cohesion: 0.50
Nodes (4): margin-bleed-marks render macro, registration-marks render macro, trim-marks render macro, registration-mark render macro

### Community 125 - "Community 125"
Cohesion: 0.67
Nodes (3): gel/index.js public API, Gel Effects Doc, Transitions.js (page/section transition entry point)

### Community 128 - "Community 128"
Cohesion: 0.67
Nodes (3): browserslist, defaults, not IE 11

### Community 129 - "Community 129"
Cohesion: 0.67
Nodes (3): engines, node, npm

### Community 130 - "Community 130"
Cohesion: 0.67
Nodes (3): repository, type, url

### Community 135 - "Community 135"
Cohesion: 0.67
Nodes (3): ink-marks render macro, colors render macro, neutrals render macro

### Community 136 - "Community 136"
Cohesion: 0.67
Nodes (3): Organizations component, Project Details component, Roles component

## Ambiguous Edges - Review These
- `serializePortableTextToHtml()` → `Lightbox`  [AMBIGUOUS]
  data/sanity/transforms/portableText.md · relation: references
- `serializePortableTextToHtml()` → `Lightbox Molecule`  [AMBIGUOUS]
  data/sanity/transforms/portableText.md · relation: references
- `bio-motion/fade.js` → `bio-motion/reduced.js`  [AMBIGUOUS]
  js/choreography/molecules/bio-motion/fade.md · relation: conceptually_related_to
- `OrganizationsTriggers.js` → `ProcessTriggers.js`  [AMBIGUOUS]
  js/choreography/organisms/process/ProcessTriggers.md · relation: conceptually_related_to
- `CMS Services README` → `Frontend Documentation Index`  [AMBIGUOUS]
  docs/README.docs.md · relation: conceptually_related_to
- `views/organisms/section/process.njk` → `organizations.njk`  [AMBIGUOUS]
  views/organisms/section/process.md · relation: references
- `Blockframes Layouts (positioning algorithms)` → `Blockframes Templates (atomic design level 4)`  [AMBIGUOUS]
  js/displays/blockframes/layouts/README.layouts.md · relation: conceptually_related_to
- `video render macro` → `video render macro`  [AMBIGUOUS]
  views/atoms/video/video.md · relation: references
- `Image Card Molecule` → `Lightbox Molecule`  [AMBIGUOUS]
  views/molecules/lightbox/lightbox.md · relation: semantically_similar_to
- `BuildInfo.render macro` → `BuildInfo.render macro`  [AMBIGUOUS]
  views/molecules/list/build-info.md · relation: references

## Knowledge Gaps
- **509 isolated node(s):** `titleStyle`, `msgStyle`, `successStyle`, `infoStyle`, `errorStyle` (+504 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **80 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `serializePortableTextToHtml()` and `Lightbox`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `serializePortableTextToHtml()` and `Lightbox Molecule`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `bio-motion/fade.js` and `bio-motion/reduced.js`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `OrganizationsTriggers.js` and `ProcessTriggers.js`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `CMS Services README` and `Frontend Documentation Index`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `views/organisms/section/process.njk` and `organizations.njk`?**
  _Edge tagged AMBIGUOUS (relation: references) - confidence is low._
- **What is the exact relationship between `Blockframes Layouts (positioning algorithms)` and `Blockframes Templates (atomic design level 4)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._