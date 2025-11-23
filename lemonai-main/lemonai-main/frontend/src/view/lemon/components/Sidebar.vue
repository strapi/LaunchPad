<template>
  <div class="sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-header">
      <button class="menu-button" @click="toggleCollapse">
        <span class="menu-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"></line>
            <line x1="3" y1="6" x2="21" y2="6"></line>
            <line x1="3" y1="18" x2="21" y2="18"></line>
          </svg>
        </span>
      </button>
      <button class="search-button">
        <span class="search-icon">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"></circle>
            <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
          </svg>
        </span>
      </button>
    </div>

    <div class="sidebar-content">
      <button class="new-task-button">
        <span class="plus-icon">+</span>
        <span class="button-text">新建任务</span>
        <span class="shortcut">⌘ K</span>
      </button>

      <div class="chat-list">
        <div v-for="chat in chats" :key="chat.conversation_id" class="chat-item"
          :class="{ 'active': chat.conversation_id === conversationId }" @click="setActiveChat(chat)">
          <div class="chat-icon" :class="chat.iconStyle">
            {{ chat.icon }}
          </div>
          <div class="chat-details">
            <div class="chat-header">
              <div class="chat-title">{{ chat.title }}</div>
              <div class="chat-time">{{ chat.time }}</div>
            </div>
            <div class="chat-preview">{{ chat.preview }}</div>
          </div>
        </div>
      </div>
    </div>

    <div class="sidebar-footer">
      <div class="user-profile">
        <div class="avatar">
          <img src="" alt="User avatar" />
        </div>
        <div class="user-name">yi bo</div>
      </div>
      <div class="footer-actions">
        <button class="footer-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
        </button>
        <button class="footer-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
          </svg>
        </button>
        <button class="footer-button">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
const isCollapsed = ref(false);
import { useChatStore } from '@/store/modules/chat';
const chatStore = useChatStore();

const { conversationId } = storeToRefs(chatStore);
const props = defineProps({
  chats: {
    type: Array,
    default: () => []
  }
});

// 切换侧边栏展开/收起状态
const toggleCollapse = () => {
  isCollapsed.value = !isCollapsed.value;
};

import { useRouter } from 'vue-router';
const router = useRouter();

const setActiveChat = (chat) => {
  conversationId.value = chat.conversation_id;
  chatStore.clearMessages();
  router.push(`/lemon/${chat.conversation_id}`);
};
</script>

<style lang="scss" scoped>
.sidebar {
  display: flex;
  flex-direction: column;
  width: 380px;
  height: 100vh;
  background-color: #ebebeb;
  transition: width 0.3s ease;
  overflow: hidden;

  &.collapsed {
    width: auto;

    .button-text,
    .chat-details,
    .user-name,
    .shortcut {
      display: none;
    }

    .chat-icon {
      margin-right: 0;
    }

    .new-task-button,
    .chat-item {
      justify-content: center;
      padding: 10px;
    }

    .sidebar-footer {
      justify-content: center;
    }

    .footer-actions {
      display: none;
    }
  }
}

.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid #e0e0e0;
}

.menu-button,
.search-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 8px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }
}

.sidebar-content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #ddd;
    border-radius: 5px;
  }
}

.new-task-button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;
  color: #333;
  font-weight: 500;
  margin-bottom: 8px;

  &:hover {
    background-color: #fafafa;
  }

  .plus-icon {
    font-size: 16px;
    margin-right: 8px;
  }

  .shortcut {
    font-size: 12px;
    color: #999;
    background-color: #f5f5f5;
    padding: 2px 6px;
    border-radius: 4px;
  }
}

.chat-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.chat-item {
  display: flex;
  align-items: flex-start;
  padding: 12px 16px;
  border-radius: 8px;
  background-color: white;
  border: 1px solid #e0e0e0;
  cursor: pointer;

  &:hover {
    background-color: #f9f9f9;
  }

  &.active {
    background-color: rgba(0, 102, 255, 0.05);
    border: 1px solid rgba(0, 102, 255, 0.2);
  }
}

.chat-icon {
  margin-right: 12px;
  width: 32px;
  height: 32px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;

  &.blue-bg {
    background-color: #0066ff;
    color: white;
  }

  &.gray-bg {
    background-color: #333;
    color: white;
  }
}

.chat-details {
  flex: 1;
  min-width: 0;
}

.chat-header {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.chat-title {
  font-weight: 500;
  font-size: 14px;
  color: #333;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.chat-time {
  font-size: 12px;
  color: #999;
  white-space: nowrap;
  margin-left: 8px;
}

.chat-preview {
  font-size: 12px;
  color: #666;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.sidebar-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 16px;
  border-top: 1px solid #e0e0e0;
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 8px;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background-color: #0066ff;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  font-size: 14px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }
}

.user-name {
  font-size: 14px;
  font-weight: 500;
  color: #333;
}

.footer-actions {
  display: flex;
  gap: 12px;
}

.footer-button {
  background: none;
  border: none;
  cursor: pointer;
  color: #666;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 8px;

  &:hover {
    background-color: #f5f5f5;
    color: #333;
  }
}
</style>