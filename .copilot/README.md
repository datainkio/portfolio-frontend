# Copilot Context Files

This directory contains generated schema and context files optimized for GitHub Copilot to better understand the project structure.

## Files

- **`dbSchema.json`** - Complete Airtable base schema with field types, samples, and relationships (copy for Copilot)
- **`dbSchema.mmd`** - Mermaid diagram of database relationships

**Note**: The primary schema file is generated at `njk/_data/dbSchema.json` for 11ty global data access. This directory contains a copy for Copilot context.

## Generation

Schema files are automatically generated during the build process:

```bash
npm run build              # Generates schema as part of full build
npm run schema:generate    # Generate schema only
```

## Output Locations

The schema generation creates files in two locations:

1. **`njk/_data/airtableSchema.json`** - Primary location, accessible in templates as `{{ airtableSchema }}`
2. **`.copilot/airtable-schema.json`** - Copy for Copilot context (this directory)
3. **`.copilot/airtable-schema.compact.json`** - Minified version
4. **`.copilot/AIRTABLE_SCHEMA.md`** - Human-readable documentation

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

## Maintenance

Files are regenerated on each build to stay in sync with the Airtable base structure. No manual editing required.
