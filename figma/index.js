import { FigmaClient } from "./api/FigmaClient.js";
import { FileService } from "./services/FileService.js";
import { StyleService } from "./services/StyleService.js";
import { PaletteService } from "./services/PaletteService.js";
import { TypographyService } from "./services/TypographyService.js";
import { TokenService } from "./services/TokenService.js";

const client = new FigmaClient(); // Establish connection to Figma API
const fileService = new FileService(client); // Retrieve information and content from the Figma file
const styleService = new StyleService(client); // Retrieve detailed style info from the Figma file
const paletteService = new PaletteService(client); // Write color style info to local files
const typographyService = new TypographyService(client); // Write typography style info to local files
const tokenService = new TokenService(client); // Write spacing, radius, shadow, and type tokens to a local file

export {
  client,
  fileService,
  styleService,
  paletteService,
  typographyService,
  tokenService,
};
