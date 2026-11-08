import { FigmaClient } from "./api/FigmaClient.js";
import { VariablesService } from "./services/VariablesService.js";
import { PaletteService } from "./services/PaletteService.js";
import { TokenService } from "./services/TokenService.js";

const client = new FigmaClient(); // Establish connection to Figma API
const variablesService = new VariablesService(client); // Read the design-system library's Tokens page
const paletteService = new PaletteService(); // Write styles/colors.css from colour variables
const tokenService = new TokenService(); // Write styles/tokens.css from numeric variables and shadow styles

export { client, variablesService, paletteService, tokenService };
