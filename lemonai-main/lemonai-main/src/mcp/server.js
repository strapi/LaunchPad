const path = require("path");
const fs = require("fs");

const filepath = path.resolve(__dirname, "../../mcp-local.json");
const exists = fs.existsSync(filepath);

const McpServer = require("@src/models/McpServer");
const { Op } = require("sequelize");
const resolveMcpServers = async (mcp_server_ids = []) => {
  console.log("mcp_server_ids", mcp_server_ids);
  const servers = await McpServer.findAll({
    where: {
      id: { [Op.in]: mcp_server_ids },
      activate: true,
    },
  });
  return servers;
};

const resolveServers = async (context = {}) => {
  const { mcp_server_ids = [] } = context;
  console.log("resolveServers mcp_server_ids", mcp_server_ids);
  if (mcp_server_ids.length > 0) {
    return resolveMcpServers(mcp_server_ids);
  }
  if (exists) {
    const list = require(filepath);
    // 返回开启使用的 mcp servers
    return list.filter((item) => item.activate);
  }
  return [];
};

module.exports = exports = resolveServers;
