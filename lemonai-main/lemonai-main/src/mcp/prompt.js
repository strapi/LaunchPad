require('module-alias/register')
require('dotenv').config()
const { json2xml } = require("@src/utils/format");

const resolveMcpToolPrompt = async (tool = {}) => {
  const { id, serverName, name, description, inputSchema } = tool
  console.log(id);
  const tool_key = id || `mcp__${serverName}__${name}`
  const xml = json2xml({
    ['tool mcp_tool']: {
      name: tool_key,
      description,
      arguments: JSON.stringify(inputSchema)
    }
  })
  return xml;
}

const resolveMcpPrompt = async (tools = []) => {
  const list = []
  for (const tool of tools) {
    const prompt = await resolveMcpToolPrompt(tool);
    list.push(prompt);
  }
  return list.join('\n');
}

const mcp_client = require('./client');
const loadAllTools = async (servers = []) => {
  const all_tools = []
  for (const server of servers) {
    const tools = await mcp_client.listToolsImpl(server)
    all_tools.push(...tools)
  }
  return all_tools;
}

const resolveMcpServerPrompt = async (servers = []) => {
  if (servers.length === 0) {
    return ''
  }
  const tools = await loadAllTools(servers);
  const mcp_tool_prompt = await resolveMcpPrompt(tools);
  const mcp_guide_prompt = `
${mcp_tool_prompt}
=== mcp_tool call result format ===
<mcp_tool>
  <name>tool name</name>
  <arguments> {json_format args} </arguments>
</mcp_tool>
===`
  return mcp_guide_prompt
}

module.exports = exports = {
  resolveMcpToolPrompt,
  resolveMcpPrompt,
  resolveMcpServerPrompt
}