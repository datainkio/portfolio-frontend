import chalk from 'chalk';
import { fileURLToPath } from 'url';
import logger from '../js/utils/logger/index.js';
import { fileService, styleService, paletteService, typographyService } from '../figma/index.js';
import { buildCSS } from './buildCSS.js';

async function fetchDesignSystem() {
  // INIT MESSAGE
  console.log(chalk.cyan.bold('\n🎨 FIGMA'));
  console.log(chalk.gray('─'.repeat(50)));
  logger.trace('Starting Figma design sync:', 'Fetching design file...', 'brief', 'headsup');

  await logger.group(async () => {
    try {
      // GET DESIGN FILE DATA FROM FIGMA
      const designFile = await fileService.getDocument();
      logger.trace(
        'Design file loaded:',
        { name: designFile.name, version: designFile.version },
        'verbose',
        'standard'
      );

      // LOG DESIGN FILE DATA
      designFile.log();

      // GET STYLE DATA FROM FIGMA
      const styles = await styleService.getStyles(designFile.styleIDs);
      logger.trace(
        'Styles retrieved:',
        { colors: styles.colors?.length, textFormats: styles.textFormats?.length },
        'brief',
        'standard'
      );

      await logger.group(async () => {
        // UPDATE THE LOCAL BASE STYLES FILE
        // styles.colors
        // styles.textFormats
        // console.log(styles.colors);

        const palette = await paletteService.write(styles.colors, designFile);
        logger.trace('Palette written:', 'Color styles synced', 'brief', 'success');

        // TODO: UPDATE THE LOCAL TYPOGRAPHY FILES
        const fontImports = await typographyService.updateFontImports(
          styles.textFormats,
          designFile
        );
        logger.trace('Font imports updated:', 'Typography imports synced', 'brief', 'success');

        const textFormats = await typographyService.updateFontFamilies(
          styles.textFormats,
          designFile
        );
        logger.trace('Font families updated:', 'Typography families synced', 'brief', 'success');
        // const fontWeights = await typographyService.updateFontWeights(
        //   styles.textFormats,
        //   designFile
        // );
        // const fontImports = await typographyService.updateFontImports(
        //   styles.textFormats,
        //   designFile
        // );
      });

      logger.trace('Design sync complete:', 'All styles updated', 'brief', 'success');

      // CRITICAL: Rebuild CSS with design token changes
      // Design tokens have been updated, now rebuild CSS to integrate changes
      console.log(chalk.cyan('\n🎯 REBUILDING CSS'));
      console.log(chalk.gray('─'.repeat(50)));
      await buildCSS();

      // WE'RE DONE HERE. WRAP IT UP.
      return; //; { document: designFile, styles };
    } catch (error) {
      console.error(chalk.red('\t✗ Error fetching design file:'), error);
      logger.trace('Design sync failed:', error.message, 'verbose', 'error');
      process.exit(1);
    }
  });
}

export default fetchDesignSystem;

// Execute if run directly
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  // Clear terminal
  process.stdout.write('\x1Bc');
  // Clear browser console
  console.clear();
  fetchDesignSystem();
}
