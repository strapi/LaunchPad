const fs = require('fs').promises;
const path = require('path');
const { createStrapi } = require('@strapi/strapi');

// Adjust path to point to content directory from strapi/scripts/
const CONTENT_DIR = path.join(__dirname, '../../content/_imports/securebase');

async function main() {
  console.log('Initializing Strapi...');
  // Load Strapi without starting the server (just the app context)
  const strapi = await createStrapi({ distDir: './dist' }).load();
  
  try {
    console.log('Strapi loaded successfully.');
    
    const files = await fs.readdir(CONTENT_DIR);
    
    for (const file of files) {
      if (!file.endsWith('.md')) continue;
      
      console.log(`Processing ${file}...`);
      const filePath = path.join(CONTENT_DIR, file);
      const { metadata, body } = await parseMarkdown(filePath);
      
      const slug = metadata.slug || file.replace('.md', '').toLowerCase();

      // Check if article already exists
      const existing = await strapi.entityService.findMany('api::article.article', {
        filters: { slug: slug }
      });
      
      if (existing && existing.length > 0) {
        console.log(`Article "${metadata.title}" (${slug}) already exists. Skipping.`);
        continue;
      }

      // Upload Image
      // Use a generic placeholder from Unsplash
      const imageUrl = `https://images.unsplash.com/photo-1579546929518-9e396f3cc809?w=800&q=80`;
      const imageId = await uploadImageInternal(strapi, imageUrl, slug);
      
      // Create Article
      await strapi.entityService.create('api::article.article', {
        data: {
          title: metadata.title || file.replace('.md', ''),
          description: metadata.description || 'Imported content',
          slug: slug,
          content: [
            {
              type: "paragraph",
              children: [
                {
                  type: "text",
                  text: body.substring(0, 500) + "..." // Truncate to avoid block complexity for now
                }
              ]
            }
          ],
          image: imageId,
          publishedAt: new Date(), // Publish immediately
        }
      });
      
      console.log(`Created article: ${metadata.title}`);
    }
    
    console.log('Ingestion complete!');
    
  } catch (error) {
    console.error('Ingestion failed:', error);
  } finally {
    strapi.stop();
    process.exit(0);
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

async function uploadImageInternal(strapi, imageUrl, name) {
  try {
    // Use global fetch (Node 18+)
    const response = await fetch(imageUrl);
    if (!response.ok) throw new Error(`Failed to fetch image: ${response.statusText}`);
    
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    const uploadService = strapi.plugin('upload').service('upload');
    
    const fileStat = {
        name: `${name}.jpg`,
        type: 'image/jpeg',
        size: buffer.length,
        buffer: buffer,
    };
    
    const result = await uploadService.upload({
        data: {},
        files: fileStat
    });
    
    // Result is usually an array if multiple files, or object if single
    // But uploadService.upload with 'files' as object usually returns array
    const uploadedFile = Array.isArray(result) ? result[0] : result;
    return uploadedFile.id;

  } catch (e) {
    console.error('Image upload failed:', e.message);
    return null;
  }
}

main();
