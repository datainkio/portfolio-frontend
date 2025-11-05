# Copilot Context Files

This directory contains generated schema and context files optimized for GitHub Copilot to better understand the project structure.

## Files

- **`airtable-schema.json`** - Complete Airtable base schema with field types, samples, and relationships
- **`airtable-schema.compact.json`** - Minified version for faster loading
- **`AIRTABLE_SCHEMA.md`** - Human-readable schema documentation

## Generation

Schema files are automatically generated during the build process:

```bash
npm run build              # Generates schema as part of full build
npm run schema:generate    # Generate schema only
```

## Purpose

These files provide Copilot with:

- Complete table structure and field definitions
- Type information inferred from actual data
- Sample values showing data patterns
- Relationship mappings between tables
- Usage examples for templates

This enables Copilot to:

- Suggest accurate field names when working with collections
- Understand data relationships
- Provide better code completions for Nunjucks templates
- Reference actual field types and values

## Maintenance

Files are regenerated on each build to stay in sync with the Airtable base structure. No manual editing required.
