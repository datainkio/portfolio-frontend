#!/usr/bin/env node
/** @format */

/**
 * Component Scaffolding Script - Rapid Template Generation
 *
 * CRITICAL WARNING: This script generates standardized component templates
 * with proper frontmatter, documentation, and integration hooks for the
 * dataink.io portfolio architecture. Use this for ALL new components to
 * maintain consistency with Figma design tokens and CMS integration.
 *
 * ARCHITECTURE COMPLIANCE:
 * - Follows atomic design principles (atoms/molecules/organisms)
 * - Includes proper frontmatter for auto-documentation
 * - Generates Component API macros (render(params = {}))
 * - Maintains GSAP animation compatibility
 * - Supports Figma design token integration
 *
 * USAGE:
 * npm run scaffold:component atoms button-group
 * npm run scaffold:component molecules project-card
 * npm run scaffold:page portfolio
 * npm run scaffold:layout blog-post
 *
 * CRITICAL DEPENDENCIES:
 * - views/ directory structure
 * - specs/views/component-api.views-spec.md (component skeleton)
 * - Logger utility for consistent output
 * - Figma design token structure
 */

import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import chalk from "chalk";
import { projectRoot } from "../lib/paths.js";

/**
 * Component Templates - Standardized component scaffolding
 */
/**
 * Component API skeleton (specs/views/component-api.views-spec.md): one
 * `render(params = {})` macro that reads only `params` and appends the
 * caller's `classes` to its baseline through the `classes` filter.
 */
const componentTemplate = (tier, rootTag) => (name, componentName) => `{#-
  ${componentName} (${tier}).
  Import without context:
    {% import "${tier}s/${name}.njk" as ${componentName.replace(/ /g, "")} %}
  Document every param in the sidecar's Params table, and add a page under
  ia/docs/design/${tier}s/ (contract: views/layouts/design-doc.md).
-#}
{%- macro render(params = {}) -%}
  {%- set baseline = "" -%}
  <${rootTag} class="{{ [baseline, params.classes] | classes }}">
    {%- if caller %}{{ caller() }}{% else %}{{ params.content }}{% endif -%}
  </${rootTag}>
{%- endmacro -%}
`;

const templates = {
  atom: componentTemplate("atom", "span"),
  molecule: componentTemplate("molecule", "div"),
  organism: componentTemplate("organism", "section"),

  page: (name, componentName) => `---
layout: templates/base.njk
permalink: /${name}/
title: '${componentName}'
subtitle: 'Page subtitle'
metaDescription: '${componentName} page description'
metaKeywords: 'keyword1, keyword2, keyword3'
canonicalUrl: 'https://dataink.io/${name}/'
bodyStyles: 'bg-neutral-dark'
headerClasses: 'text-neutral-light'
# GSAP Scripts - Include if page uses animations
scripts: >
  <script type="module" src="/assets/js/choreography/Director.js" defer></script>
---

{# ${componentName} Page Template #}
{# 
CRITICAL WARNING: This page integrates with:
- GSAP animation system (if scripts included)
- CMS collections (via collections.*)
- Figma design tokens (via CSS classes)

ANIMATION COMPATIBILITY:
- Element IDs must match GSAP controller expectations
- Use data-scroll attributes for ScrollTrigger
- Maintain consistent CSS class structure
#}

{# Page Content: import components without context and call their render macros,
   e.g. {% import "organisms/section/work.njk" as Work %} then {{ Work.render({ ... }) }} #}
<main class="${name}-page">
  {# Page sections #}
</main>`,
};

/**
 * Casing helpers for choreography section names.
 * Input is kebab-case (e.g. "case-study"); sections key off camelCase and
 * are classed in PascalCase.
 */
const toPascalCase = (name) =>
  name
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

const toCamelCase = (name) => {
  const pascal = toPascalCase(name);
  return pascal.charAt(0).toLowerCase() + pascal.slice(1);
};

/**
 * Choreography Section Templates — the AbstractSection triad + sidecars.
 *
 * Generates a complete organism (controller + Animations + Triggers) wired to
 * the system base classes and contract barrels, matching the conventions in
 * js/choreography/organisms/. Single-variant by default; add variants per the
 * choreography skill's "Add a variant" recipe.
 */
const sectionTemplates = {
  controller: (
    Name,
    key,
  ) => `import AbstractSection from "../../system/AbstractSection.js";
import { SELECTORS } from "../../config/index/index.js";
import ${Name}Animations from "./${Name}Animations.js";
import ${Name}Triggers from "./${Name}Triggers.js";

/**
 * ${Name} — section controller.
 *
 * Resolves its view by SELECTORS.${key}, composes the Animations + Triggers
 * modules, and delegates lifecycle + bus coordination to AbstractSection.
 * Auto-disables (no-ops) if the element is absent.
 */
export default class ${Name} extends AbstractSection {
  constructor({ bus = null, reducedMotionHandler } = {}) {
    const view = document.getElementById(SELECTORS.${key});
    const animations = new ${Name}Animations(view);
    const triggers = new ${Name}Triggers(view);

    super({
      view,
      animations,
      triggers,
      sectionKey: "${key}",
      bus,
      reducedMotionHandler,
    });
  }
}
`,

  animations: (
    Name,
    key,
  ) => `import AbstractSectionAnimations from "../../system/AbstractSectionAnimations.js";
import { gsap } from "/assets/js/choreography/system/gsap.js";
import { TIMELINE_IDS } from "../../config/contracts/timelines/timelines.js";
import { ANIMATION_DEFAULTS } from "../../config/ix/motion.js";

const ${key.toUpperCase()}_EL_ATTR = "data-${key}-el";

const select${Name}El = (view, name) =>
  view?.querySelector(\`[\${${key.toUpperCase()}_EL_ATTR}="\${name}"]\`) ?? null;

/**
 * ${Name}Animations — builds the four lifecycle timelines.
 *
 * Each _build* returns a timeline tagged with its TIMELINE_IDS id, or null for
 * a phase this section does not use. Pull all timing from motion tokens —
 * never hardcode duration/ease/distance/stagger.
 */
export default class ${Name}Animations extends AbstractSectionAnimations {
  _buildLanding() {
    // Pre-state for the reveal (instant). Return null if not needed.
    return null;
  }

  _buildIntro() {
    const tl = gsap.timeline({ id: TIMELINE_IDS.intro });
    tl.from(this.view, {
      autoAlpha: 0,
      y: 24,
      duration: ANIMATION_DEFAULTS.duration,
      ease: ANIMATION_DEFAULTS.ease.out,
    });
    return tl;
  }

  _buildIdle() {
    return null;
  }

  _buildOutro() {
    return null;
  }
}
`,

  triggers: (
    Name,
    key,
  ) => `import AbstractSectionTriggers from "../../system/AbstractSectionTriggers.js";
import { SCROLL_DEFAULTS } from "../../config/ix/scrolltriggers.js";
import { SELECTORS } from "../../config/index/index.js";

/**
 * ${Name} ScrollTrigger defaults.
 *
 * Geometry (start/end/trigger/id) lives here; capability flags (scrub/pin/once)
 * come from the active motion profile via composeScrollTrigger. Keep this
 * profile-agnostic.
 */
export const ${key.toUpperCase()}_TRIGGER = {
  ...SCROLL_DEFAULTS,
  id: SELECTORS.${key},
  start: "top center",
  end: "bottom center",
};

export default class ${Name}Triggers extends AbstractSectionTriggers {
  _getTriggerDefaults() {
    return ${key.toUpperCase()}_TRIGGER;
  }
}
`,

  sidecar: (Name, key, kind) => {
    const id = `frontend.js.choreography.organisms.${key.toLowerCase()}.${kind.toLowerCase()}`;
    const roles = {
      controller: `${Name} section controller — manages lifecycle, ScrollTrigger binding, and bus coordination.`,
      animations: `${Name} section animations — builds the landing/intro/idle/outro lifecycle timelines from motion tokens.`,
      triggers: `${Name} section triggers — owns the section ScrollTrigger geometry and binding.`,
    };
    return `---
id: ${id}
role: "${roles[kind]}"
status: draft
surface: internal
scope: frontend
runtime: browser
tags:
  - "#frontend"
  - "#design/motion/js"
  - "#design/motion/choreography"
  - "#design/atomic-design/organism"
links:
  - "[[AbstractSection|AbstractSection]]"
  - "[[config/index|config/index]]"
---
`;
  },
};

/**
 * Generate a choreography section (organism triad + sidecars) and print the
 * remaining one-line contract-wiring steps.
 */
function generateSection(name) {
  const Name = toPascalCase(name);
  const key = toCamelCase(name);
  const targetDir = resolve(projectRoot, `js/choreography/organisms/${name}`);

  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const files = [
    [`${Name}.js`, sectionTemplates.controller(Name, key)],
    [`${Name}Animations.js`, sectionTemplates.animations(Name, key)],
    [`${Name}Triggers.js`, sectionTemplates.triggers(Name, key)],
    [`${Name}.md`, sectionTemplates.sidecar(Name, key, "controller")],
    [`${Name}Animations.md`, sectionTemplates.sidecar(Name, key, "animations")],
    [`${Name}Triggers.md`, sectionTemplates.sidecar(Name, key, "triggers")],
  ];

  let wroteAny = false;
  for (const [filename, contents] of files) {
    const filePath = resolve(targetDir, filename);
    if (existsSync(filePath)) {
      console.log(chalk.yellow(`⚠️  Skipped existing: ${filename}`));
      continue;
    }
    writeFileSync(filePath, contents);
    console.log(chalk.green(`✅ Created ${filename}`));
    wroteAny = true;
  }

  if (!wroteAny) {
    console.log(chalk.gray("Nothing written (all files already exist)."));
    return;
  }

  console.log(
    chalk.blue.bold(
      `\n🔌 Wire "${key}" into the contracts (each is one edit):\n`,
    ),
  );
  console.log(
    `  1. config/contracts/events/events.js   →  ${key}: makeSectionEvents("${key}"),`,
  );
  console.log(
    `  2. config/contracts/selectors/selectors.js  →  ${key}: "${key}",   (under "Section IDs")`,
  );
  console.log(
    `  3. system/registry.js  →  import ${Name} from "../organisms/${name}/${Name}.js";  then add  ${key}: ${Name},`,
  );
  console.log(
    `  4. (optional) config/ix/profiles.js  →  SECTION_OVERRIDES.${key} if it needs variants/capability tweaks`,
  );
  console.log(
    chalk.gray(
      `\nThen add the section element (id matching SELECTORS.${key}) to the template, plus data-${key}-el hooks for inner targets.`,
    ),
  );
}

/**
 * Generate component file
 */
function generateComponent(type, category, name) {
  const componentName = name
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");

  let template;
  let targetDir;
  let filename;

  if (type === "page") {
    template = templates.page(name, componentName);
    targetDir = resolve(projectRoot, `views/pages/${name}`);
    filename = `${name}.njk`;
  } else {
    template = templates[type](name, componentName);
    targetDir = resolve(projectRoot, `views/${category}`);
    filename = `${name}.njk`;
  }

  // Create directory if it doesn't exist
  if (!existsSync(targetDir)) {
    mkdirSync(targetDir, { recursive: true });
  }

  const filePath = resolve(targetDir, filename);

  // Check if file already exists
  if (existsSync(filePath)) {
    console.log(chalk.yellow(`⚠️  File already exists: ${filePath}`));
    console.log(chalk.gray("Use --force to overwrite"));
    return;
  }

  // Write component file
  writeFileSync(filePath, template);

  console.log(chalk.green(`✅ Created ${type}: ${filePath}`));
  console.log(
    chalk.blue(
      type === "page"
        ? `📝 Next: import components into ${filename} and render them`
        : `📝 Usage: {% import "${category}/${name}.njk" as X %} then {{ X.render({ ... }) }}. Add its sidecar and a page under ia/docs/design/${category}/.`,
    ),
  );
}

/**
 * List available components
 */
function listComponents() {
  console.log(chalk.blue.bold("\n📦 AVAILABLE COMPONENTS\n"));

  console.log(chalk.green("Atoms:"));
  console.log("  - icon (consolidated icon system)");
  console.log("  - button/button (UI actions)");
  console.log("  - avatar, heading, input, field");
  console.log("  - link/* (navigation)");
  console.log("  - video/* (media)");

  console.log(chalk.green("\nMolecules:"));
  console.log("  - (scan molecules/ directory)");

  console.log(chalk.green("\nOrganisms:"));
  console.log("  - section/* (page sections)");

  console.log(chalk.green("\nTemplates:"));
  console.log("  - base, blog, documentation, landing, parallax");

  console.log(chalk.blue("\n🚀 SCAFFOLDING COMMANDS:"));
  console.log("  npm run scaffold:component atoms button-group");
  console.log("  npm run scaffold:component molecules project-card");
  console.log("  npm run scaffold:component organisms hero-section");
  console.log("  npm run scaffold:page portfolio");
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(chalk.red("❌ Missing command"));
    console.log(
      chalk.blue("Usage: npm run scaffold:component <category> <name>"),
    );
    console.log(chalk.blue("       npm run scaffold:page <name>"));
    console.log(chalk.blue("       npm run scaffold:list"));
    return;
  }

  switch (command) {
    case "component":
      const category = args[1];
      const name = args[2];

      if (!category || !name) {
        console.log(chalk.red("❌ Missing category or name"));
        console.log(
          chalk.blue(
            "Usage: npm run scaffold:component <atoms|molecules|organisms> <name>",
          ),
        );
        return;
      }

      if (!["atoms", "molecules", "organisms"].includes(category)) {
        console.log(
          chalk.red("❌ Invalid category. Use: atoms, molecules, organisms"),
        );
        return;
      }

      const type =
        category === "atoms"
          ? "atom"
          : category === "molecules"
            ? "molecule"
            : "organism";

      generateComponent(type, category, name);
      break;

    case "page":
      const pageName = args[1];
      if (!pageName) {
        console.log(chalk.red("❌ Missing page name"));
        console.log(chalk.blue("Usage: npm run scaffold:page <name>"));
        return;
      }
      generateComponent("page", "pages", pageName);
      break;

    case "section":
      const sectionName = args[1];
      if (!sectionName) {
        console.log(chalk.red("❌ Missing section name"));
        console.log(chalk.blue("Usage: npm run scaffold:section <kebab-name>"));
        return;
      }
      generateSection(sectionName);
      break;

    case "list":
      listComponents();
      break;

    default:
      console.log(chalk.red(`❌ Unknown command: ${command}`));
      console.log(
        chalk.blue("Available commands: component, page, section, list"),
      );
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateComponent, generateSection, listComponents };
