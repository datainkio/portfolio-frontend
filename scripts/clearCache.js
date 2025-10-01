import { rm } from 'fs/promises';
import { join } from 'path';

const cacheDir = join(process.cwd(), '.cache');

try {
  await rm(cacheDir, { recursive: true, force: true });
  console.log('✓ Cache cleared');
} catch (error) {
  console.error('✗ Error clearing cache:', error);
}