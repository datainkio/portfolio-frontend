/**
 * ---
 * aix:
 *   id: frontend.figma.index
 *   role: Figma tooling module: figma/index.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - index.js
 * ---
 */
import { FigmaClient } from './api/FigmaClient.js';
import { FileService } from './services/FileService.js';
import { StyleService } from './services/StyleService.js';
import { PaletteService } from './services/PaletteService.js';
import { TypographyService } from './services/TypographyService.js';

const client = new FigmaClient(); // Establish connection to Figma API
const fileService = new FileService(client); // Retrieve information and content from the Figma file
const styleService = new StyleService(client); // Retrieve detailed style info from the Figma file
const paletteService = new PaletteService(client); // Write color style info to local files
const typographyService = new TypographyService(client); // Write typography style info to local files

export { client, fileService, styleService, paletteService, typographyService };