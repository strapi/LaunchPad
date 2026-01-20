const fs = require('fs');
const path = require('path');

/**
 * @typedef {import('types/Tool').Tool } Tool
 */

/** @type {Object.<string, Tool>} */
const tools = {};
const ignored = new Set(['browser_use']);

const files = fs.readdirSync(__dirname);
const filterFn = file => {
  return (file.indexOf('.') !== 0) && (file !== path.basename(__filename)) && (file.slice(-3) === '.js');
}
for (const file of files.filter(filterFn)) {
  try {
    const def = require(path.join(__dirname, file));
    const tool = def.name || path.basename(file, '.js');
    if (ignored.has(tool)) continue
    tools[tool] = def;
  } catch (error) {
    console.error(`Error loading from ${file}:`, error);
  }
}

module.exports = tools;