/**
 * ---
 * aix:
 *   id: frontend.figma.services.fileservice
 *   role: Figma tooling module: figma/services/FileService.js
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
import chalk from 'chalk';
import { ENDPOINTS } from '../api/endpoints.js';
import { DesignFile } from '../models/DesignFile.js';

export class FileService {
  constructor(client) {
    this.client = client;
  }

  async getDocument() {
    console.log(chalk.cyan('\tfetching design file...'));
    const data = await this.client.fetch(ENDPOINTS.file(this.client.FILE_ID))
    console.log(chalk.gray('\t↳ design file fetched'));
    return new DesignFile(data, this.client.FILE_ID);
  }

  async getNodes(nodeIds) {
    return this.client.fetch(ENDPOINTS.nodes(this.client.FILE_ID, nodeIds));
  }

  async getStyles(styleIds) {
    return this.client.fetch(ENDPOINTS.styles(this.client.FILE_ID, styleIds));
  }
}