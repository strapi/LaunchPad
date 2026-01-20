require('module-alias/register');
require('dotenv').config();

const tools = require("@src/tools/index");

const convertTool = (tool) => {
  const fn = {
    type: 'function',
    function: {
      name: tool.name,
      description: tool.description,
      parameters: tool.params
    }
  }
  return fn;
}

const resolveFunctionCall = async () => {
  const list = Object.values(tools);
  // @ts-ignore
  return list.map(convertTool);
}

module.exports = exports = resolveFunctionCall;