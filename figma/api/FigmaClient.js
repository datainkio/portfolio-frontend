/**
 * ---
 * aix:
 *   id: frontend.figma.api.figmaclient
 *   role: Figma tooling module: figma/api/FigmaClient.js
 *   status: stable
 *   surface: internal
 *   scope: frontend
 *   runtime: node
 *   tags:
 *     - frontend
 *     - figma
 *     - api
 * ---
 */
import dotenv from 'dotenv';
dotenv.config();

import { ENDPOINTS } from './endpoints.js';

export class FigmaClient {
  constructor() {
    this.API_URL = 'https://api.figma.com/v1';
    this.TOKEN = process.env.FIGMA_TOKEN ?? process.env.FIGMA_ACCESS_TOKEN;
    this.FILE_ID = process.env.FIGMA_FILE_ID;

    if (!this.TOKEN || !this.FILE_ID) {
      const missing = [];
      if (!this.TOKEN) missing.push('FIGMA_TOKEN (or legacy FIGMA_ACCESS_TOKEN)');
      if (!this.FILE_ID) missing.push('FIGMA_FILE_ID');
      throw new Error(`Missing Figma configuration: ${missing.join(', ')}`);
    }
  }

  async fetch(endpoint) {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      headers: { 'X-Figma-Token': this.TOKEN },
    });
    return response.json();
  }
}
