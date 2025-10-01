import dotenv from 'dotenv';
dotenv.config();

import { ENDPOINTS } from './endpoints.js';

export class FigmaClient {
  constructor() {
    this.API_URL = "https://api.figma.com/v1";
    this.TOKEN = process.env.FIGMA_ACCESS_TOKEN;
    this.FILE_ID = process.env.FIGMA_FILE_ID;
    
    if (!this.TOKEN || !this.FILE_ID) {
      throw new Error('Missing Figma configuration');
    }
  }

  async fetch(endpoint) {
    const response = await fetch(`${this.API_URL}${endpoint}`, {
      headers: { "X-Figma-Token": this.TOKEN }
    });
    return response.json();
  }
}