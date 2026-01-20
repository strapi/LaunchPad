const fs = require('fs');
const path = require('path');

const tools = {};

const ignored = new Set(['browser_use']);

// Read all files in the current directory
fs.readdirSync(__dirname).filter(file => {
  // Filter out non-JS files and the index file itself
  return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
}).forEach(file => {
  // Derive the tool name from the filename (e.g., browser_use.js -> browser_use)
  const toolName = path.basename(file, '.js');
  // Require the file and add it to the tools object
  try {
    // handle ignored tools
    if (ignored.has(toolName)) return;
    // add tool
    tools[toolName] = require(path.join(__dirname, file));
  } catch (error) {
    console.error(`Error loading tool ${toolName} from ${file}:`, error);
  }
});

module.exports = tools;