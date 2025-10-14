import chalk from 'chalk';
import { fileURLToPath } from 'url';
import logger from '../js/utils/logger/index.js';
import { fileService, styleService, paletteService, typographyService } from '../figma/index.js';

async function fetchDesignSystem() {
  try {
    // INIT MESSAGE
    console.log(chalk.cyan.bold('\n🎨 FIGMA'));
    console.log(chalk.gray('─'.repeat(50)));

    // GET DESIGN FILE DATA FROM FIGMA
    const designFile = await fileService.getDocument();
    logger.trace(
      'Design file loaded:',
      { name: designFile.name, version: designFile.version },
      'verbose'
    );

    // LOG DESIGN FILE DATA
    designFile.log();

    // GET STYLE DATA FROM FIGMA
    const styles = await styleService.getStyles(designFile.styleIDs);
    logger.trace(
      'Styles retrieved:',
      { colors: styles.colors?.length, textFormats: styles.textFormats?.length },
      'brief'
    );

    // UPDATE THE LOCAL BASE STYLES FILE
    // styles.colors
    // styles.textFormats
    // console.log(styles.colors);

    const palette = await paletteService.write(styles.colors, designFile);

    // TODO: UPDATE THE LOCAL TYPOGRAPHY FILES
    const fontImports = await typographyService.updateFontImports(styles.textFormats, designFile);
    const textFormats = await typographyService.updateFontFamilies(styles.textFormats, designFile);
    // const fontWeights = await typographyService.updateFontWeights(
    //   styles.textFormats,
    //   designFile
    // );
    // const fontImports = await typographyService.updateFontImports(
    //   styles.textFormats,
    //   designFile
    // );

    // WE'RE DONE HERE. WRAP IT UP.
    return; //; { document: designFile, styles };
  } catch (error) {
    console.error(chalk.red('\t✗ Error fetching design file:'), error);
    process.exit(1);
  }
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
