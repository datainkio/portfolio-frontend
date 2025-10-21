#!/usr/bin/env node
/** @format */

/**
 * Component Scaffolding Script - Rapid Template Generation
 *
 * CRITICAL WARNING: This script generates standardized component templates
 * with proper frontmatter, documentation, and integration hooks for the
 * dataink.io portfolio architecture. Use this for ALL new components to
 * maintain consistency with Figma design tokens and Airtable integration.
 *
 * ARCHITECTURE COMPLIANCE:
 * - Follows atomic design principles (atoms/molecules/organisms)
 * - Includes proper frontmatter for auto-documentation
 * - Integrates with component registry system
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
 * - njk/_includes/ directory structure
 * - _registry.njk component system
 * - Logger utility for consistent output
 * - Figma design token structure
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import chalk from 'chalk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, '..');

/**
 * Component Templates - Standardized component scaffolding
 */
const templates = {
  atom: (name, componentName) => `---
# ${componentName} Component - Atomic UI Element
#
# CRITICAL WARNING: This component integrates with Figma design tokens
# Styles are auto-generated from design system - DO NOT hardcode values
#
# PROPS:
name: "${name}"
category: "atoms"
props:
  # Define component props here
  content: { type: "string", required: true, description: "Component content" }
  className: { type: "string", default: "", description: "Additional CSS classes" }
#
# USAGE EXAMPLES:
examples:
  - { content: "Example content" }
  - { content: "Styled example", className: "custom-styles" }
#
# FIGMA INTEGRATION:
# - Uses design tokens from styles/colors.css
# - Typography from styles/typography/
# - Spacing follows design system grid
#
# GSAP ANIMATION COMPATIBILITY:
# - Maintains element structure for animations
# - Supports ScrollTrigger integration
# - Uses stable CSS classes for animation targets
---

<div class="{{name}} {{ className }}">
  {{ content | default("${componentName} content") }}
</div>`,

  molecule: (name, componentName) => `---
# ${componentName} Component - Molecular UI Pattern
#
# CRITICAL WARNING: This molecule combines atomic components
# Ensure atomic dependencies are available and properly imported
#
# PROPS:
name: "${name}"
category: "molecules"
props:
  title: { type: "string", required: true, description: "Component title" }
  content: { type: "string", required: false, description: "Component content" }
  variant: { type: "string", default: "default", options: ["default", "featured"], description: "Visual variant" }
#
# ATOMIC DEPENDENCIES:
# - atoms/heading (for title display)
# - atoms/button (for actions)
# - atoms/icon (for visual elements)
#
# AIRTABLE INTEGRATION:
# - Supports dynamic content from collections
# - Handles missing data gracefully
---

{% from "_includes/_registry.njk" import component %}

<div class="${name} ${name}--{{ variant | default('default') }}">
  {{ component("atoms", "heading", { content: title, level: 3 }) }}
  
  {% if content %}
    <div class="${name}__content">
      {{ content }}
    </div>
  {% endif %}
</div>`,

  organism: (name, componentName) => `---
# ${componentName} Component - Complex UI Organism
#
# CRITICAL WARNING: This organism may integrate with GSAP animations
# Maintain element IDs and CSS classes for animation system compatibility
#
# PROPS:
name: "${name}"
category: "organisms"
props:
  data: { type: "object", required: true, description: "Data object from Airtable collections" }
  animationId: { type: "string", default: "", description: "GSAP animation identifier" }
#
# ANIMATION DEPENDENCIES:
# - May require specific element IDs for GSAP targeting
# - ScrollTrigger integration points marked with data-scroll
# - Animation timelines defined in js/choreography/sections/
#
# AIRTABLE INTEGRATION:
# - Processes collection data from njk/_data/
# - Supports multiple content types
# - Handles empty states gracefully
---

{% from "_includes/_registry.njk" import component %}

<section 
  class="${name}"
  {% if animationId %}id="{{ animationId }}"{% endif %}
  data-scroll-section
>
  <!-- GSAP Animation Target: Maintain this structure -->
  <div class="${name}__container">
    {% for item in data %}
      {{ component("molecules", "${name}-item", item) }}
    {% endfor %}
  </div>
</section>`,

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
- Airtable collections (via collections.*)
- Figma design tokens (via CSS classes)

ANIMATION COMPATIBILITY:
- Element IDs must match GSAP controller expectations
- Use data-scroll attributes for ScrollTrigger
- Maintain consistent CSS class structure
#}

{% from "_includes/_registry.njk" import component %}

{# Page Content #}
<main class="${name}-page">
  {{ component("organisms", "${name}-hero", { 
    title: title, 
    subtitle: subtitle 
  }) }}
  
  {# Additional page sections #}
  {% if collections.${name} %}
    {{ component("organisms", "${name}-content", { 
      data: collections.${name} 
    }) }}
  {% endif %}
</main>`,
};

/**
 * Generate component file
 */
function generateComponent(type, category, name) {
  const componentName = name
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');

  let template;
  let targetDir;
  let filename;

  if (type === 'page') {
    template = templates.page(name, componentName);
    targetDir = resolve(projectRoot, 'njk/_pages');
    filename = `${name}.njk`;
  } else {
    template = templates[type](name, componentName);
    targetDir = resolve(projectRoot, `njk/_includes/${category}`);
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
    console.log(chalk.gray('Use --force to overwrite'));
    return;
  }

  // Write component file
  writeFileSync(filePath, template);

  console.log(chalk.green(`✅ Created ${type}: ${filePath}`));
  console.log(chalk.blue(`📝 Usage: component("${category}", "${name}", { props })`));
}

/**
 * List available components
 */
function listComponents() {
  console.log(chalk.blue.bold('\n📦 AVAILABLE COMPONENTS\n'));

  console.log(chalk.green('Atoms:'));
  console.log('  - icon (consolidated icon system)');
  console.log('  - button/button (UI actions)');
  console.log('  - avatar, heading, input, field');
  console.log('  - link/* (navigation)');
  console.log('  - video/* (media)');

  console.log(chalk.green('\nMolecules:'));
  console.log('  - (scan molecules/ directory)');

  console.log(chalk.green('\nOrganisms:'));
  console.log('  - section/* (page sections)');

  console.log(chalk.green('\nTemplates:'));
  console.log('  - base, blog, documentation, landing, parallax');

  console.log(chalk.blue('\n🚀 SCAFFOLDING COMMANDS:'));
  console.log('  npm run scaffold:component atoms button-group');
  console.log('  npm run scaffold:component molecules project-card');
  console.log('  npm run scaffold:component organisms hero-section');
  console.log('  npm run scaffold:page portfolio');
}

/**
 * Main execution
 */
function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (!command) {
    console.log(chalk.red('❌ Missing command'));
    console.log(chalk.blue('Usage: npm run scaffold:component <category> <name>'));
    console.log(chalk.blue('       npm run scaffold:page <name>'));
    console.log(chalk.blue('       npm run scaffold:list'));
    return;
  }

  switch (command) {
    case 'component':
      const category = args[1];
      const name = args[2];

      if (!category || !name) {
        console.log(chalk.red('❌ Missing category or name'));
        console.log(
          chalk.blue('Usage: npm run scaffold:component <atoms|molecules|organisms> <name>')
        );
        return;
      }

      if (!['atoms', 'molecules', 'organisms'].includes(category)) {
        console.log(chalk.red('❌ Invalid category. Use: atoms, molecules, organisms'));
        return;
      }

      const type =
        category === 'atoms' ? 'atom' : category === 'molecules' ? 'molecule' : 'organism';

      generateComponent(type, category, name);
      break;

    case 'page':
      const pageName = args[1];
      if (!pageName) {
        console.log(chalk.red('❌ Missing page name'));
        console.log(chalk.blue('Usage: npm run scaffold:page <name>'));
        return;
      }
      generateComponent('page', 'pages', pageName);
      break;

    case 'list':
      listComponents();
      break;

    default:
      console.log(chalk.red(`❌ Unknown command: ${command}`));
      console.log(chalk.blue('Available commands: component, page, list'));
  }
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main();
}

export { generateComponent, listComponents };
