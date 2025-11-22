import fs from 'fs/promises';
import path from 'path';
import fetch from 'node-fetch';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const STRAPI_URL = 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_TOKEN; // User must provide this
const CONTENT_DIR = path.join(__dirname, '../content/_imports/securebase');

if (!STRAPI_TOKEN) {
  console.error('Error: STRAPI_TOKEN environment variable is not set.');
  console.error('Please generate a token in Strapi Admin > Settings > API Tokens and run:');
  console.error('$env:STRAPI_TOKEN="your_token_here"; node scripts/ingest-content.mjs');
  process.exit(1);
}

async function uploadImage(imageUrl, name) {
  try {
    console.log(`Fetching image from ${imageUrl}...`);
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const buffer = await response.buffer();
    const formData = new FormData();
    
    formData.append('files', buffer, {
      filename: `${name}.jpg`,
      contentType: 'image/jpeg',
    });

    const uploadRes = await fetch(`${STRAPI_URL}/api/upload`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${STRAPI_TOKEN}`,
        ...formData.getHeaders(),
      },
      body: formData,
    });

    if (!uploadRes.ok) {
      const errorText = await uploadRes.text();
      throw new Error(`Failed to upload image: ${uploadRes.status} ${errorText}`);
    }

    const data = await uploadRes.json();
    return data[0]; // Return the first uploaded file object
  } catch (error) {
    console.error('Image upload failed:', error.message);
    return null;
  }
}

async function createEntry(collection, data) {
  try {
    const response = await fetch(`${STRAPI_URL}/api/${collection}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${STRAPI_TOKEN}`,
      },
      body: JSON.stringify({ data }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Failed to create entry: ${response.status} ${errorText}`);
    }

    const result = await response.json();
    console.log(`Created entry in ${collection}: ${result.data.id}`);
    return result.data;
  } catch (error) {
    console.error(`Entry creation failed for ${collection}:`, error.message);
  }
}

async function parseMarkdown(filePath) {
  const content = await fs.readFile(filePath, 'utf-8');
  const frontmatterRegex = /^---\n([\s\S]*?)\n---/;
  const match = content.match(frontmatterRegex);
  
  let metadata = {};
  let body = content;

  if (match) {
    const frontmatter = match[1];
    body = content.replace(frontmatterRegex, '').trim();
    
    frontmatter.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':');
      if (key && valueParts.length) {
        let value = valueParts.join(':').trim();
        if (value.startsWith('"') && value.endsWith('"')) {
          value = value.slice(1, -1);
        }
        metadata[key.trim()] = value;
      }
    });
  }

  return { metadata, body };
}

async function main() {
  try {
    const files = await fs.readdir(CONTENT_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      console.log(`Processing ${file}...`);
      const { metadata, body } = await parseMarkdown(path.join(CONTENT_DIR, file));
      
      // Use Unsplash source for placeholder
      const imageUrl = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80`; // Generic gradient/abstract
      
      const uploadedImage = await uploadImage(imageUrl, metadata.slug || 'image');
      
      const articleData = {
        title: metadata.title || file.replace('.md', ''),
        description: metadata.description || 'Imported content',
        slug: metadata.slug || file.replace('.md', '').toLowerCase(),
        content: [
          {
            type: "paragraph",
            children: [
              {
                type: "text",
                text: body.substring(0, 500) + "..." // Truncate for block text to avoid issues
              }
            ]
          }
        ],
        image: uploadedImage ? uploadedImage.id : null,
      };

      await createEntry('articles', articleData);
    }
    
    console.log('Ingestion complete!');
  } catch (error) {
    console.error('Script failed:', error);
  }
}

main();
