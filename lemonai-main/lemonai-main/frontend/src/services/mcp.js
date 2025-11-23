import http from "@/utils/http.js";

const service = {
  connect(server){
    const uri = `/api/mcp_server/connect`;
    return http.post(uri, server);
  },
  activate_servers(){
    const uri = `/api/mcp_server/active`;
    return http.get(uri);
  }
};

export default service;