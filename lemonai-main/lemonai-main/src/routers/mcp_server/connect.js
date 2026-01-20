const router = require("koa-router")();

const mcp_client = require("@src/mcp/client");

router.post("/connect", async ({ request, response }) => {
  const server = request.body;
  const connected = await mcp_client.checkMcpConnectivity(server);
  if (connected) {
    return response.success({ ok: true });
  }
  response.fail({
    ok: false,
    error: "Failed to connect to MCP server",
    details: "MCP server is not connected",
  });
});

module.exports = exports = router.routes();
