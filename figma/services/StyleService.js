/**
 * ---
 * aix:
 *   id: frontend.figma.services.styleservice
 *   role: Figma tooling module: figma/services/StyleService.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - services
 * ---
 */
import { FileService } from './FileService.js';
import { createStyle } from '../utils/styleFactory.js';
import { Color } from '../models/fills/Color.js';
import { TextFormat } from '../models/text/TextFormat.js';
import { Pattern } from '../models/fills/Pattern.js';
import chalk from 'chalk';

export class StyleService {
  constructor(client) {
    this.client = client;
    this.fileService = new FileService(client);
    // this.paletteService = new PaletteService(client);
    // this.typographyService = new TypographyService(client);
  }

  async getStyles(styleIDs) {
    console.log(chalk.cyan('\tfetching style data...'));
    const styles = await this.fileService.getStyles(styleIDs);
    const styleDocs = Object.values(styles.nodes)
    .map(node => node.document)
    .filter(document => document !== undefined);

    /**
     * Style data now looks like this:
     *{
        id: '83:857',
        name: 'secondary/light',
        type: 'RECTANGLE',
        scrollBehavior: 'SCROLLS',
        boundVariables: { fills: [Array] },
        blendMode: 'PASS_THROUGH',
        fills: [ [Object] ],
        strokes: [],
        strokeWeight: 1,
        strokeAlign: 'INSIDE',
        absoluteBoundingBox: { x: 0, y: 0, width: 100, height: 100 },
        absoluteRenderBounds: { x: 0, y: 0, width: 100, height: 100 },
        constraints: { vertical: 'TOP', horizontal: 'LEFT' },
        effects: [],
        interactions: [],
        },
     */

    // For each style document, create the appropriate style object
    const groupedStyles = {
      colors: [],
      textFormats: [],
      patterns: [],
    };
    
    styleDocs.forEach(doc => {
      const style = createStyle(doc);
      if (style instanceof Color) {
        groupedStyles.colors.push(style);
      } else if (style instanceof TextFormat) {
        groupedStyles.textFormats.push(style);
      } else if (style instanceof Pattern) {
        groupedStyles.patterns.push(style);
      }
    });

    // Write styles using the groupedStyles object
    await Promise.all([
         console.log(chalk.gray('\t↳ style data fetched'))
    ]);

    return groupedStyles;
  }

  writeBaseStyles(styles, designFile) {
    // return BaseStylesFile.write(styles.textFormats, designFile);
  }
}