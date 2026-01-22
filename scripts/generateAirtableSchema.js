/**
 * ---
 * aix:
 *   id: frontend.scripts.generateairtableschema
 *   role: Build/utility script: scripts/generateAirtableSchema.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - scripts
 *     - generateAirtableSchema.js
 * ---
 */
/** @format */

/**
 * Generate Airtable Schema for Copilot
 *
 * Creates a comprehensive schema document from Airtable data that includes:
 * - Table structure with all field names and types
 * - Sample data showing actual values
 * - Field usage statistics
 * - Relationship mappings between tables
 *
 * Output is optimized for Copilot context:
 * - Compact JSON format
 * - Type inference from actual data
 * - Common field patterns highlighted
 * - Relational links documented
 */

import logger, { LumberjackStyle } from '@datainkio/lumberjack';
import fetchAirtableData from '../airtable/fetchAirtableData.js';
import { writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { config } from 'dotenv';

logger.enabled = true;

// Load environment variables
config();

// Custom logger styles
const titleStyle = new LumberjackStyle('#0A9396', '📊');
const msgStyle = new LumberjackStyle('#CA6702', '•');
const successStyle = new LumberjackStyle('#0A9396', '✓');

// Get site configuration
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const siteConfigPath = join(__dirname, '../njk/_data/site.json');
const site = JSON.parse(
  await import('fs').then(fs => fs.promises.readFile(siteConfigPath, 'utf-8'))
);

/**
 * Infer field type from value
 * @param {*} value - Field value to analyze
 * @returns {string} Type name
 */
function inferType(value) {
  if (value === null || value === undefined) return 'null';
  if (Array.isArray(value)) {
    if (value.length === 0) return 'array (empty)';
    const firstItem = value[0];
    if (firstItem === null || firstItem === undefined) return 'array<null>';
    if (typeof firstItem === 'string' && firstItem.startsWith('rec')) {
      return 'array<recordId>';
    }
    if (typeof firstItem === 'object' && firstItem.url) {
      return 'array<attachment>';
    }
    return `array<${typeof firstItem}>`;
  }
  if (typeof value === 'object') {
    if (value.url && value.filename) return 'attachment';
    return 'object';
  }
  if (typeof value === 'string') {
    if (value.match(/^\d{4}-\d{2}-\d{2}/)) return 'date';
    if (value.startsWith('rec')) return 'recordId';
    if (value.length > 200) return 'longText';
    return 'string';
  }
  if (typeof value === 'number') {
    return Number.isInteger(value) ? 'integer' : 'number';
  }
  if (typeof value === 'boolean') return 'boolean';
  return typeof value;
}

/**
 * Analyze field patterns across all records
 * @param {Array} records - Array of record objects
 * @param {string} fieldName - Field to analyze
 * @returns {Object} Field analysis
 */
function analyzeField(records, fieldName) {
  const values = records.map(r => r[fieldName]).filter(v => v !== null && v !== undefined);

  const types = [...new Set(values.map(inferType))];
  const nullable = records.some(r => r[fieldName] === null || r[fieldName] === undefined);
  const uniqueValues = [...new Set(values.map(v => JSON.stringify(v)))].length;

  // Get sample values (first 3 unique non-null values)
  const samples = [...new Set(values.slice(0, 10))].slice(0, 3).map(v => {
    if (typeof v === 'string' && v.length > 50) {
      return v.substring(0, 50) + '...';
    }
    if (Array.isArray(v) && v.length > 3) {
      return [...v.slice(0, 3), '...'];
    }
    return v;
  });

  return {
    types,
    nullable,
    fillRate: ((values.length / records.length) * 100).toFixed(1) + '%',
    uniqueCount: uniqueValues,
    samples: samples.length > 0 ? samples : ['(no data)'],
  };
}

/**
 * Extract schema from table data
 * @param {string} tableName - Name of the table
 * @param {Array} data - Array of records
 * @returns {Object} Schema information
 */
function extractSchema(tableName, data) {
  if (!data || data.length === 0) {
    return {
      tableName,
      recordCount: 0,
      fields: {},
      relationships: [],
    };
  }

  // Get all unique field names across all records
  const allFields = new Set();
  data.forEach(record => {
    Object.keys(record).forEach(key => allFields.add(key));
  });

  const fields = {};
  const relationships = [];

  // Analyze each field
  allFields.forEach(fieldName => {
    const analysis = analyzeField(data, fieldName);
    fields[fieldName] = analysis;

    // Detect relationships (fields that reference other records)
    if (analysis.types.some(t => t.includes('recordId'))) {
      relationships.push({
        field: fieldName,
        type: analysis.types.includes('array<recordId>') ? 'hasMany' : 'hasOne',
        description: `References other records via ${fieldName}`,
      });
    }
  });

  return {
    tableName,
    recordCount: data.length,
    fields,
    relationships,
  };
}

/**
 * Generate complete schema document
 */
async function generateSchema() {
  logger.trace('Generating Airtable Schema', null, 'brief', titleStyle);
  logger.trace('', 'Analyzing base structure for Copilot optimization', 'brief', msgStyle);

  if (!site || !site.airtables) {
    logger.trace('Configuration error:', 'Missing site.airtables in site.json', 'brief', 'error');
    return;
  }

  const schemas = {};
  const summary = {
    generated: new Date().toISOString(),
    baseId: process.env.AIRTABLE_BASE_TOKEN?.substring(0, 8) + '...',
    tableCount: site.airtables.length,
    tables: {},
  };

  // Fetch and analyze each table
  for (const table of site.airtables) {
    logger.trace('', `Analyzing ${table.tableName}...`, 'brief', msgStyle);

    try {
      const data = await fetchAirtableData(table);
      const schema = extractSchema(table.tableName, data);
      schemas[table.tableName] = schema;

      summary.tables[table.tableName] = {
        recordCount: schema.recordCount,
        fieldCount: Object.keys(schema.fields).length,
        relationships: schema.relationships.length,
        view: table.tableView,
      };

      logger.trace(
        '',
        `✓ ${table.tableName}: ${schema.recordCount} records, ${Object.keys(schema.fields).length} fields`,
        'brief',
        successStyle
      );
    } catch (error) {
      logger.trace('Schema error:', error, 'verbose');
      schemas[table.tableName] = extractSchema(table.tableName, []);
    }
  }

  // Create comprehensive schema document
  const schemaDoc = {
    _meta: {
      description: 'Airtable base schema for dataink.io portfolio',
      generated: summary.generated,
      baseId: summary.baseId,
      purpose:
        'Copilot context - provides complete structure of CMS tables, fields, and relationships',
      usage:
        'Reference this schema when working with Airtable collections in templates or understanding data structure',
    },
    summary,
    tables: schemas,
  };

  // Write schema to njk/_data for 11ty global data access
  const outputPath = join(__dirname, '../njk/_data/dbSchema.json');
  writeFileSync(outputPath, JSON.stringify(schemaDoc, null, 2));

  logger.trace('', `Schema written to njk/_data/dbSchema.json`, 'brief', successStyle);

  // Also write to .copilot for Copilot context
  const copilotPath = join(__dirname, '../.copilot/airtable-schema.json');
  writeFileSync(copilotPath, JSON.stringify(schemaDoc, null, 2));

  logger.trace('', `Copilot version: .copilot/airtable-schema.json`, 'brief', successStyle);

  // Generate compact version for faster loading
  const compactPath = join(__dirname, '../.copilot/airtable-schema.compact.json');
  writeFileSync(compactPath, JSON.stringify(schemaDoc));

  logger.trace('', `Compact version: .copilot/airtable-schema.compact.json`, 'brief', successStyle);

  // Generate human-readable summary
  const readmePath = join(__dirname, '../.copilot/AIRTABLE_SCHEMA.md');
  const readme = generateReadme(schemaDoc);
  writeFileSync(readmePath, readme);

  // Generate Mermaid ER diagram
  const mermaidPath = join(__dirname, '../njk/_data/dbSchema.mmd');
  const mermaidDiagram = generateMermaidDiagram(schemaDoc);
  writeFileSync(mermaidPath, mermaidDiagram);

  logger.trace('', `Mermaid diagram: njk/_data/dbSchema.mmd`, 'brief', successStyle);

  logger.trace('Schema generation complete', null, 'brief', titleStyle);

  return schemaDoc;
}

/**
 * Generate markdown summary of schema
 * @param {Object} schemaDoc - Complete schema document
 * @returns {string} Markdown content
 */
function generateReadme(schemaDoc) {
  const { summary, tables } = schemaDoc;

  let md = `# Airtable Schema Reference\n\n`;
  md += `**Generated:** ${new Date(summary.generated).toLocaleString()}\n\n`;
  md += `**Base ID:** ${summary.baseId}\n\n`;
  md += `## Summary\n\n`;
  md += `- **Tables:** ${summary.tableCount}\n`;
  md += `- **Total Records:** ${Object.values(summary.tables).reduce((sum, t) => sum + t.recordCount, 0)}\n\n`;

  md += `## Tables Overview\n\n`;
  md += `| Table | Records | Fields | Relationships | View |\n`;
  md += `|-------|---------|--------|---------------|------|\n`;

  Object.entries(summary.tables).forEach(([name, info]) => {
    md += `| ${name} | ${info.recordCount} | ${info.fieldCount} | ${info.relationships} | ${info.view} |\n`;
  });

  md += `\n## Detailed Schema\n\n`;

  Object.entries(tables).forEach(([tableName, schema]) => {
    md += `### ${tableName}\n\n`;
    md += `**Records:** ${schema.recordCount}\n\n`;

    if (schema.recordCount === 0) {
      md += `*(No records found)*\n\n`;
      return;
    }

    md += `#### Fields\n\n`;
    md += `| Field | Type | Fill Rate | Samples |\n`;
    md += `|-------|------|-----------|----------|\n`;

    Object.entries(schema.fields).forEach(([fieldName, field]) => {
      const types = field.types.join(', ');
      const samples = field.samples
        .map(s => {
          if (typeof s === 'string') return `"${s}"`;
          return JSON.stringify(s);
        })
        .join(', ');
      md += `| ${fieldName} | ${types} | ${field.fillRate} | ${samples} |\n`;
    });

    md += `\n`;

    if (schema.relationships.length > 0) {
      md += `#### Relationships\n\n`;
      schema.relationships.forEach(rel => {
        md += `- **${rel.field}** (${rel.type}): ${rel.description}\n`;
      });
      md += `\n`;
    }
  });

  md += `## Usage in Templates\n\n`;
  md += `Access collections in Nunjucks templates:\n\n`;
  md += `\`\`\`njk\n`;
  md += `{# Get all records from a table #}\n`;
  md += `{% for project in collections.projects %}\n`;
  md += `  {{ project.title }}\n`;
  md += `{% endfor %}\n\n`;
  md += `{# Table names are lowercase in collections #}\n`;
  md += `{{ collections.organizations | length }} organizations\n`;
  md += `\`\`\`\n\n`;

  md += `## Reference\n\n`;
  md += `- Configuration: \`njk/_data/site.json\`\n`;
  md += `- Fetch logic: \`airtable/fetchAirtableData.js\`\n`;
  md += `- Collection setup: \`eleventy/collections/content.js\`\n`;

  return md;
}

/**
 * Generate Mermaid ER diagram
 * @param {Object} schemaDoc - Complete schema document
 * @returns {string} Mermaid diagram code
 */
function generateMermaidDiagram(schemaDoc) {
  const { tables } = schemaDoc;

  let mmd = 'erDiagram\n';

  // First, define all entities with their key fields
  Object.entries(tables).forEach(([tableName, table]) => {
    if (table.recordCount === 0) return;

    mmd += `    ${tableName.toUpperCase()} {\n`;

    // Add key fields (id, title, slug, published are common)
    const keyFields = ['id', 'title', 'slug', 'published', 'name', 'body', 'description'];
    const fieldsToShow = [];

    Object.entries(table.fields).forEach(([fieldName, field]) => {
      if (keyFields.includes(fieldName)) {
        const type = field.types[0] || 'string';
        const key = fieldName === 'id' ? ' PK' : '';
        fieldsToShow.push(`        ${type} ${fieldName}${key}`);
      }
    });

    mmd += fieldsToShow.slice(0, 6).join('\n') + '\n';
    mmd += '    }\n    \n';
  });

  // Track processed relationships to avoid duplicates
  const processedRelationships = new Set();

  // Then, define relationships
  Object.entries(tables).forEach(([tableName, table]) => {
    if (table.recordCount === 0 || !table.relationships) return;

    table.relationships.forEach(rel => {
      // Skip self-referential and id fields
      if (rel.field === 'id') return;

      // Try to infer the target table from field name
      let targetTable = null;

      // Common patterns: projects, organizations, etc.
      const fieldLower = rel.field.toLowerCase();

      // Look for exact table name matches (plural or singular)
      Object.keys(tables).forEach(tName => {
        const tLower = tName.toLowerCase();
        if (fieldLower === tLower || fieldLower === tLower + 's' || fieldLower + 's' === tLower) {
          targetTable = tName;
        }
      });

      // Special cases
      if (
        fieldLower.includes('thumbnail') ||
        fieldLower.includes('logo') ||
        fieldLower.includes('banner')
      ) {
        targetTable = 'Images';
      } else if (fieldLower.includes('video')) {
        targetTable = 'Videos';
      } else if (fieldLower.includes('organization')) {
        targetTable = 'Organizations';
      } else if (fieldLower.includes('project')) {
        targetTable = 'Projects';
      } else if (fieldLower.includes('category') || fieldLower === 'parent') {
        targetTable = 'IA';
      } else if (fieldLower.includes('award')) {
        targetTable = 'Awards';
      }

      if (!targetTable || !tables[targetTable]) return;

      // Create unique relationship key
      const relKey = `${tableName}-${targetTable}-${rel.field}`;
      const reverseKey = `${targetTable}-${tableName}-${rel.field}`;

      // Skip if we've already processed this relationship
      if (processedRelationships.has(relKey) || processedRelationships.has(reverseKey)) return;
      processedRelationships.add(relKey);

      // Determine cardinality
      const fromCard = rel.type === 'hasMany' ? '||--o{' : '}o--||';
      const label = rel.field.replace(/\s+/g, '-');

      mmd += `    ${tableName.toUpperCase()} ${fromCard} ${targetTable.toUpperCase()} : "${label}"\n`;
    });
  });

  return mmd;
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  generateSchema().catch(error => {
    logger.trace('Schema generation failed:', error, 'verbose');
    process.exit(1);
  });
}

export default generateSchema;
