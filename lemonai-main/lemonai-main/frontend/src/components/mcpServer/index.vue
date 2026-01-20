<template>
  <div class="mcp-manager-container">
    <div class="top-action-bar">
      <h2 class="title">{{ $t("setting.mcpService.title") }}</h2>
      <div class="actions">
        <a-button @click="showImportModal">
          <template #icon>
            <ImportOutlined />
          </template>
          {{ $t("setting.mcpService.importFromJson") }}
        </a-button>
        <a-button type="primary" @click="handleAddServer" style="margin-left: 8px">
          <template #icon>
            <PlusOutlined />
          </template>
          {{ $t("setting.mcpService.addMcpServer") }}
        </a-button>
      </div>
    </div>

    <div class="main-content">
      <div class="server-list-panel">
        <ServerList :servers="mcpServerList" :selectedServerId="chooseMCPServer?.id" @select="handleMcpServer" />
      </div>
      <div class="server-settings-panel">
        <template v-if="chooseMCPServer">
          <ServerSettings :server="chooseMCPServer" @update:server="handleUpdateServer" @save="handleMCPServerSave" @delete="handleMCPServerDelete" />
        </template>
        <div v-else class="no-server-placeholder">
          <div class="placeholder-content">
            <div class="placeholder-icon">
              <CodeOutlined />
            </div>
            <p class="placeholder-text">{{ $t("setting.mcpService.noServerSelected") }}</p>
          </div>
        </div>
      </div>
    </div>

    <a-modal
      v-model:visible="importModalVisible"
      :title="$t('setting.mcpService.importModalTitle')"
      @ok="handleImportOk"
      :ok-text="$t('setting.mcpService.ok')"
      :cancel-text="$t('setting.mcpService.cancel')"
    >
      <pre>{{ exampleJson }}</pre>
      <a-textarea v-model:value="importJsonText" placeholder="" :rows="10" />
    </a-modal>
  </div>
</template>

<script setup>
import { ref, onMounted, watch, computed } from "vue";
import { storeToRefs } from "pinia";
import { message } from "ant-design-vue";
import { PlusOutlined, CodeOutlined, ImportOutlined } from "@ant-design/icons-vue";
import { useI18n } from "vue-i18n";
import ServerList from "./ServerList.vue";
import ServerSettings from "./ServerSettings.vue";
import { useServerStore } from "@/store/modules/server";

const { t } = useI18n();
const serverStore = useServerStore();
const { servers: mcpServerList } = storeToRefs(serverStore);
const { addServer, updateServer, deleteServer, fetchServers } = serverStore;

const chooseMCPServer = ref(null);
const importModalVisible = ref(false);
const importJsonText = ref("");

const exampleServer = {
  mcpServers: {
    "amap-amap-sse": {
      url: "https://mcp.amap.com/sse?key=amap_key",
    },
  },
};

const exampleJson = JSON.stringify(exampleServer, null, 2);

const handleMcpServer = (server) => {
  chooseMCPServer.value = server;
};

const handleUpdateServer = (server) => {
  chooseMCPServer.value = { ...chooseMCPServer.value, ...server };
};

const handleMCPServerSave = () => {
  if (chooseMCPServer.value) {
    updateServer(chooseMCPServer.value);
  }
};

const handleMCPServerDelete = (serverId) => {
  deleteServer(serverId);
};

const handleAddServer = () => {
  const newServer = {
    name: "MCP Server",
    description: "",
    activate: false,
    type: "stdio",
    command: "",
    registryUrl: "",
    args: [],
    env: {},
  };
  addServer(newServer);
};

const showImportModal = () => {
  importModalVisible.value = true;
  importJsonText.value = "";
};

const resolveMcpServerType = (server) => {
  const { url = "", command = "" } = server;
  if (url.includes("sse")) {
    return "sse";
  } else if (command.startsWith("npx") || command.startsWith("uvx")) {
    return "stdio";
  } else if (url.includes("mcp")) {
    return "streamableHttp";
  }
  return "stdio";
};

const handleImportOk = () => {
  try {
    const importData = JSON.parse(importJsonText.value);

    if (importData.mcpServers) {
      const servers = importData.mcpServers;
      let serversAddedCount = 0;
      for (const serverName in servers) {
        if (Object.prototype.hasOwnProperty.call(servers, serverName)) {
          const serverConfig = servers[serverName];
          const type = resolveMcpServerType(serverConfig);

          const newServer = {
            name: serverName,
            description: serverConfig.description || "",
            activate: false,
            url: serverConfig.url,
            type: type,
            command: type === "stdio" ? serverConfig.command : "",
            args: serverConfig.args || [],
            env: serverConfig.env || {},
          };
          addServer(newServer);
          serversAddedCount++;
        }
      }

      if (serversAddedCount > 0) {
        message.success(t("mcpService.importSuccess", { count: serversAddedCount }));
      } else {
        message.warn(t("mcpService.noValidServer"));
      }
    } else {
      if (!importData.name) {
        message.error(t("mcpService.nameRequired"));
        return;
      }
      addServer(importData);
      message.success(t("mcpService.importSuccessSingle"));
    }

    importModalVisible.value = false;
  } catch (e) {
    message.error(t("mcpService.invalidJson"));
    console.error("JSON parsing error:", e);
  }
};

watch(
  () => [...mcpServerList.value],
  (newServers, oldServers) => {
    if (newServers.length > oldServers.length) {
      const addedServer = newServers.find((ns) => !oldServers.some((os) => os.id === ns.id));
      if (addedServer) {
        chooseMCPServer.value = addedServer;
        return;
      }
    }

    const selectedServerExists = chooseMCPServer.value && newServers.some((s) => s.id === chooseMCPServer.value.id);
    if (!selectedServerExists) {
      chooseMCPServer.value = newServers[0] || null;
    }
  },
  {
    deep: true,
  }
);

onMounted(() => {
  fetchServers();
});
</script>

<style scoped lang="scss">
.mcp-manager-container {
  display: flex;
  flex-direction: column;
  height: 100%;
  background-color: #f0f2f5;
}

.top-action-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 24px;
  background-color: #fff;
  border-bottom: 1px solid #e8e8e8;

  .title {
    font-size: 20px;
    font-weight: 500;
    margin: 0;
  }
}

.main-content {
  display: flex;
  flex-grow: 1;
  overflow: hidden;
  padding: 24px;
  gap: 24px;
}

.server-list-panel {
  width: 280px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.server-settings-panel {
  flex-grow: 1;
  background: #fff;
  border-radius: 8px;
  overflow-y: auto;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.03);
}

.no-server-placeholder {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  padding: 50px;

  .placeholder-content {
    text-align: center;
    color: rgba(0, 0, 0, 0.25);

    .placeholder-icon {
      font-size: 48px;
      margin-bottom: 16px;
    }

    .placeholder-text {
      font-size: 16px;
      margin: 0;
    }
  }
}

pre {
  background-color: #f5f5f5;
  padding: 10px;
  border-radius: 4px;
  white-space: pre-wrap;
  word-wrap: break-word;
}
</style>
