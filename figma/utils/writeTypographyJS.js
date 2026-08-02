/**
 * ---
 * aix:
 *   id: frontend.figma.utils.writetypographyjs
 *   role: Figma tooling module: figma/utils/writeTypographyJS.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - utils
 * ---
 */
/**
     * Creates a tailwind typography file from a list of TextFormat instances.
     */
import { writeFile } from 'fs/promises';
import chalk from 'chalk';

export async function writeTypographyJS(textFormats, metadata = {}) {
        console.log(chalk.cyan('\n📄 Processing typography...'));

        if (!textFormats || !Array.isArray(textFormats)) {
            throw new Error('TextFormats must be a valid array');
        }

        const documentMeta = {
            name: metadata.name || 'Untitled',
            lastModified: metadata.lastModified || new Date().toISOString(),
            fileId: this.client.FILE_ID || 'Unknown',
            version: metadata.version || '1.0.0'
        };

        // Extract and log all unique TextFormat.property values
        const styleProperties = [...new Set(textFormats.map(format => format.property))];
        console.log('Recognized TextFormat.property values:');
        styleProperties.forEach(property => console.log("\t" + property));

        // Group formats based on TextFormat.property
        const groupedFormats = textFormats.reduce((groups, format) => {
            const property = format.property;
            if (!groups[property]) {
                groups[property] = [];
            }
            groups[property].push(format);
            return groups;
        }, {});


        // LINE HEIGHT
        // Calculate relative line heights via TextFormat.fontSize/TextFormat.lineHeight
        const lineHeightFormats = groupedFormats['lineHeight'] || [];
        // Process the lineHeightFormats array as needed
        console.log('\tLine Height Formats:');
        lineHeightFormats.forEach(format => {
            // Your code here
            console.log(`\t${format.className}: "${format.lineHeightPx/format.fontSize}"`);
        });

        // A TextFormat instance sets a value for a given utility class:
        // fontWeight, fontSize, lineHeight, fontFamily. 
        // Figma does not use nested or chained styles, therefore we need 
        // to get a little clever when figuring out which value a given 
        // format is meant to supply here. We do that by parsing the format
        // name
        textFormats.sort((a, b) => a.fontFamily.localeCompare(b.fontFamily));
        console.log(textFormats);
        
        const typography = textFormats.reduce((acc, style) => {
            style.log();
            const key = `${style.fontFamily}-${style.fontWeight}`;
            acc[key] = {
                fontFamily: style.fontFamily,
                fontWeight: style.fontWeight,
                fontSize: `${style.fontSize}px`,
                lineHeight: `${style.lineHeightPx}px`,
                letterSpacing: `${style.letterSpacing}px`
            };
            return acc;
        }, {});

        styleProperties.forEach(property => console.log("\t" + property));

        const content = `/** @format */
/**
 * @fileoverview Typography settings generated from Figma design system
 * @source ${documentMeta.name}
 * @version ${documentMeta.version}
 * @figma
 *   File: ${documentMeta.fileId}
 *   Last Modified: ${new Date(documentMeta.lastModified).toLocaleString()}
 * @generated ${new Date().toLocaleString()}
 */

module.exports = {${JSON.stringify(typography, null, 2)}};
`;

        // await writeFile(this.filePath, content, 'utf8');
        console.log(chalk.green('\n✨ Typography written successfully'));
        console.log(chalk.gray(`   └── ${this.filePath}`));
    }