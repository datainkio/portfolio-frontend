<!-- @format -->

# DATAINK.IO 2025

A dynamic portfolio website built with 11ty, integrating Tailwind CSS design
tokens from Figma.

## Project Overview

This project combines:

- Airtable as CMS
- 11ty as the static site generator
- Tailwind CSS for utility-first styling
- Figma API integration to sync design tokens
- DaisyUI for Tailwind-based components

## Design System Integration

The project automatically syncs design tokens from Figma:

- Color palettes
- Typography styles
- Component patterns
- Layout spacing

## Project Structure

### Getting Started

1. Set up Figma integration
2. Install dependencies
3. Run development server
4. Build for production

### Design System

The project uses Tailwind CSS with design tokens from Figma:

Colors synced from Figma swatches Typography scales from design system
Spacing/layout tokens from components Automatic dark mode variants Configuration
lives in tailwind.config.js with token processing in figma.js.

FIGMA DESIGN FILE The figma package pulls document data and style information
from the specified file and writes it to a set of JS files for import into
tailwind.config.js. It expects the styles in the file to be structured like so:
Text styles

- fontFamily -- display -- serif -- sans
- fontSize -- 9xl -- 8xl -- ... -- base -- sm -- xs
- lineHeight -- none -- snug -- normal -- relaxed -- loose

site.json

- site info -- name -- author -- Google Tag Manager info
- Manifest
- CMS: table names, views, and cache duration
