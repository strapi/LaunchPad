<template>
  <div class="chat-header">
    <div class="header-left">
      <h1 class="chat-title">{{ title }}</h1>
    </div>

    <div class="header-right">
      <!-- <div class="share-btn" @click="$emit('share')">
        <Share />
        <span style="min-width: max-content;">{{ $t('lemon.chatHeader.share') }}</span>
      </div> -->
      <div class="search-file-btn btn ">
        <a-tooltip :title="$t('lemon.chatHeader.viewAllFiles')" placement="bottom" :arrow="false">
          <SearchFile @click="handleFileExplorer" />
        </a-tooltip>
      </div>
      <!-- <div class="collect-btn btn" @click="handleCollect" :class="{ 'favorite': isFavorite }">
        <a-tooltip :title="favoriteTitle" placement="bottom" :arrow="false">
          <Collect @click="$emit('collect')" />
        </a-tooltip>
      </div> -->
      <div class="more-btn btn" @click="handleMore">
        <a-tooltip :title="$t('lemon.chatHeader.moreOptions')" placement="bottom" :arrow="false">
          <More />
        </a-tooltip>
        <div class="more-menu" v-if="showMore">
          <div class="edit-name" @click="handleEditName">
            <Edit />
            <span>{{ $t('lemon.chatHeader.rename') }}</span>
            <div style="width: 16px; height: 16px;"></div>
          </div>
        </div>
      </div>
    </div>
    <a-modal 
      v-model:open="open" 
      :title="$t('lemon.chatHeader.editTitle')" 
      centered  
      :width="400" 
      class="edit-title-modal" 
      :footer="null"
    > 
      <span class="edit-title">{{ $t('lemon.chatHeader.enterNewTitle') }}</span>
      <a-input v-model:value="titleValue" class="edit-title-input" />
      <footer>
        <div class="footer-btn">
          <div class="cancel-btn" @click="handleCancel">{{ $t('lemon.chatHeader.cancel') }}</div>
          <div class="confirm-btn" @click="handleOk">{{ $t('lemon.chatHeader.confirm') }}</div>
        </div>
      </footer>
    </a-modal>
  </div>
</template>

<script setup>
import emitter from '@/utils/emitter'
import { ShareAltOutlined, ToolOutlined } from '@ant-design/icons-vue'
import workspaceService from '@/services/workspace'
import { useChatStore } from '@/store/modules/chat'
import Share from '@/assets/svg/share.svg'
import Collect from '@/assets/svg/collect.svg'
import SearchFile from '@/assets/svg/searchFile.svg'
import { useI18n } from 'vue-i18n'
import More from '@/assets/svg/more.svg'
import Edit from '@/assets/svg/edit.svg'
const { t } = useI18n()
import { ref, onMounted, onUnmounted, computed } from 'vue'

const handleTerminal = () => {
  emitter.emit('preview-close', false)
  emitter.emit('terminal-visible', true)
}
const handleFileExplorer = () => {
  emitter.emit('file-explorer-visible', true)
}

import { storeToRefs } from 'pinia'
const chatStore = useChatStore()
const { chat } = storeToRefs(chatStore)

const props = defineProps({
  title: {
    type: String,
    default: ''
  }
})

const titleValue = ref('')
const showMore = ref(false)

const isFavorite = computed(() => chat.value.is_favorite)
const favoriteTitle = computed(() => isFavorite.value ? t('lemon.chatHeader.unfavorite') : t('lemon.chatHeader.favorite'))
const handleCollect = () => {
  if (isFavorite.value) {
    chatStore.unfavorite()
  } else {
    chatStore.favorite()
  }
}
const handleMore = () => {
  showMore.value = !showMore.value
}

const open = ref(false)

const handleEditName = () => {
  open.value = true
  titleValue.value = chatStore.chat.title;
}

const handleOk = () => {
  open.value = false
  chatStore.updateConversationTitle(titleValue.value)
}

const handleCancel = () => {
  open.value = false
}

const handleClickOutside = (event) => {
  const moreBtn = document.querySelector('.more-btn');
  if (moreBtn && !moreBtn.contains(event.target)) {
    showMore.value = false;
  }
};

// 在组件挂载时添加事件监听
onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

// 在组件卸载时移除事件监听
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

defineEmits(['share'])

</script>

<style lang="scss" scoped>
.chat-header {
  padding-top: .75rem;
  padding-bottom: .25rem;
  background: #f8f8f7;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 4px;
  position: sticky;
  top: 0;
  z-index: 10;
}

.header-left {
  overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.chat-title {
  font-size: 18px;
  font-weight: 500;
  color: #34322d;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 100%;
  font-family: -apple-system, BlinkMacSystemFont, Segoe UI Variable Display, Segoe UI, Helvetica, Apple Color Emoji, Arial, sans-serif, Segoe UI Emoji, Segoe UI Symbol;
  margin: 0;
}

.header-right {
  display: flex;
  align-items: center;
  gap: .5rem;

  .share-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
    padding: 0;
    border-radius: 100px;
    gap: .25rem;
    outline: 1px solid #0000000f;
    outline-offset: -1px;
    align-items: center;
    padding: 0 .75rem;
    height: 2rem;
    cursor: pointer;
  }

  .btn {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 28px;
    height: 28px;
    border-radius: .5rem;
    padding: 5px;
    cursor: pointer;
  }
}

.more-menu {
  position: absolute;
  right: -50px;
  top: 50px;
  background: #fff;
  border-radius: .75rem;
  cursor: pointer;
  border: 1px solid #0000001f;
  min-width: max-content;

  .edit-name {
    display: flex;
    align-items: center;
    gap: .75rem;
    border-radius: .75rem;
    padding: 12px 16px;
    cursor: pointer;
  }
}

.favorite {
  color: #efa201 !important;
  svg {
    stroke: #efa201 !important;
    fill: #efa201 !important;
  }
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid #e6e6e6;
  border-radius: 4px;
  background: transparent;
  color: #1f2329;
  font-size: 14px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 4px;

  &:hover {
    background: #f5f5f5;
  }

  i {
    font-size: 16px;
  }
}

.status-indicator {
  padding: 4px 16px;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  background-color: #e0e0e0;
  color: #757575;
}

.edit-title {
  font-size: 13px;
  font-weight: 400;
  color: #858481;
}

.edit-title-input {
  margin-top: 10px;
}

.footer-btn {
  display: flex;
  padding-top: 1.25rem;
  gap: .5rem;
  justify-content: flex-end;

  .cancel-btn {
    cursor: pointer;
    font-size: 13px;
    font-weight: 400;
    color: #535350;
    font-size: .875rem;
    line-height: 1.25rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: .75rem;
    padding-right: .75rem;
    border: 1px solid #0000001f;
    border-radius: 10px;
  }

  .confirm-btn {
    cursor: pointer;
    font-size: 13px;
    font-weight: 400;
    background: #1a1a19;
    color: #fff;
    font-size: .875rem;
    line-height: 1.25rem;
    padding-top: .5rem;
    padding-bottom: .5rem;
    padding-left: .75rem;
    padding-right: .75rem;
    border: 1px solid #ffffff33;
    border-radius: 10px;
  }
}

@media screen and (max-width: 768px) {
  .chat-title {
    padding-inline-start: 1.75rem;
    width: 150px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .share-btn {
    outline: none !important;
    padding: 5px !important;
    width: 28px !important;
    height: 28px !important;
    display: flex !important;
    span {
      display: none;
    }
  }
  .more-menu {
    right: -10px !important;
    left: auto;
  }
}

@media (hover: hover) and (pointer: fine) {
  .share-btn:hover {
    background: #37352f14;
  }
  .btn:hover {
    background: #37352f14;
  }
  .edit-name:hover {
    background: #37352f0f;
  }
  .confirm-btn:hover {
    opacity: .85;
  }
  .cancel-btn:hover {
    background: #37352f14;
  }
}
</style>
<style lang="scss">
.edit-title-modal {
  .ant-modal-header {
    margin-bottom: 5px !important;
  }
  .ant-modal-content {
    border-radius: 20px !important;
  }
}
</style>