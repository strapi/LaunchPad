import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CONTENT_DIR = path.join(__dirname, '../content/_imports/securebase');

async function ingest() {
  console.log('Starting content ingestion from:', CONTENT_DIR);
  
  try {
    const files = await fs.readdir(CONTENT_DIR);
    const markdownFiles = files.filter(f => f.endsWith('.md'));
    
    console.log(`Found ${markdownFiles.length} markdown files.`);
    
    for (const file of markdownFiles) {
      const content = await fs.readFile(path.join(CONTENT_DIR, file), 'utf-8');
      // Here you would parse frontmatter and push to Strapi or Database
      console.log(`Processing ${file}...`);
    }
    
    console.log('Ingestion complete.');
  } catch (error) {
    console.error('Error ingesting content:', error);
  }
}

ingest();
