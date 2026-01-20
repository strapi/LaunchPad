require('module-alias/register');
require('dotenv').config();

const resolveServers = require("@src/mcp/server");

const resolveServer = async (name, context = {}) => {
  const servers = await resolveServers(context);
  const server = servers.find(server => server.name === name);
  return server;
}

const mcp_client = require('@src/mcp/client');

const mcpToolActionCall = async (params = {}, context = {}) => {
  console.log(JSON.stringify(params, null, 2))
  const { name, arguments } = params;
  const args = typeof arguments === 'string' ? JSON.parse(arguments) : arguments;
  const [serverName, toolName] = name.split('__');
  const server = await resolveServer(serverName, context);
  const options = {
    server: server,
    name: toolName,
    args
  }
  const result = await mcp_client.callTool(options);
  if (typeof result === 'object') {
    return JSON.stringify(result);
  }
  return result;
}

module.exports = mcpToolActionCall
// run();