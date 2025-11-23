<template>
    <div class="lemon-container">
        <div class="lemon-content">
            <!-- 主页面 -->
            <div class="lemon-main">
                <ChatHeader :title="currentChat.title" />
                <ChatMessages :messages="messages" />
                <div class="scroll-to-bottom" @click="scrollToBottom" v-if="isShowScrollToBottom">
                    <Down />
                </div>
                <div class="lemon-footer">
                    <div style="display: flex;align-items: center;">
                        <div><img style="width: 20px;height: 20px; margin-right: 5px;" src="@/assets/image/lemon.jpg" alt="" /></div>
                        <span style="color: #34322d;font-size: .875rem;line-height: 1.25rem;">
                            <div v-if="playStatus!='running'">LemonAI{{ $t('task_finished') }}</div>
                            <div v-else>LemonAI{{ $t('task_playing') }}...</div>
                        </span>
                    </div>
                    <div>
                        <a-button v-if="playStatus!='running'" type="primary" @click="handleRestart">{{ $t('replay') }}</a-button>
                        <a-button v-else type="primary" @click="toResult">{{ $t('jump_to_result') }}</a-button>
                    </div>
                </div>
            </div>
            <!-- 实时预览文件-->
            <Preview class="preview" />
            <!--本地预览文件-->
            <LocalPreview class="preview" />
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, computed } from 'vue'

import Preview from '@/components/preview/index.vue'
import LocalPreview from '@/components/preview/fullPreview.vue'
import ChatHeader from '@/view/lemon/components/ChatHeader.vue'
import ChatMessages from '@/view/lemon/components/ChatMessages.vue'
import emitter from '@/utils/emitter';

import { useRoute } from 'vue-router';
const route = useRoute();

import { useChatStore } from '@/store/modules/chat';
const chatStore = useChatStore();
const isCollapsed = ref(false);

const currentChat = computed(() => chatStore.chat)
const messages = computed(() => chatStore.messages)
const playStatus = computed(() => chatStore.list.find((c) => c.conversation_id == route.params.id)?.status)

import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
}

let conversationId;
const init = async () => {
    // chatStore.messages = caseData;
    // 从路由中获取id
    conversationId = route.params.id;
    chatStore.playback(conversationId,500);
}
const handleRestart = () => {
    emitter.emit('fullPreviewVisable-close')
    chatStore.playback(conversationId,500);
};


const toResult = () => {
    chatStore.toResult();
};


const isShowScrollToBottom = ref(false);

onMounted(() => {
    //添加滚动事件监听
    init();
    const chatMessages = document.querySelector('.chat-messages');
    if (!chatMessages) return false;
    chatMessages.addEventListener('scroll', () => {
        if (chatMessages.scrollHeight - chatMessages.scrollTop - chatMessages.clientHeight > 200) {
            isShowScrollToBottom.value = true;
        } else {
            isShowScrollToBottom.value = false;
        }
    })
})

const scrollToBottom = () => {
  const chatMessages = document.querySelector('.chat-messages');
  if(!chatMessages) return false;
  chatMessages.scrollTop = chatMessages.scrollHeight - chatMessages.clientHeight;
}




</script>

<style lang="scss" scoped>
.menu-switch {
    cursor: pointer;
}

.lemon-container {
    display: flex;
    justify-content: center;
    width: 100%;
    height: 100vh;
    background: #f8f8f7;
}

.lemon-content {
    width: 100%;
    height: 100%;
    display: flex;
    overflow-y: auto;

    .lemon-main {
        min-width: 50%;
        padding-left: 1.25rem;
        padding-right: 1.25rem;
        max-width: 100%;
        width: 100%;
        overflow: hidden;
    }

    .preview {
        max-width: 50%;
        min-width: 50%;
    }
}

@media screen and (max-width: 768px) {
    .preview {
        position: absolute;
        z-index: 999;
        margin: 0px;
        width: 100vw !important;
        height: 100vh !important;
        border-radius: 0px;
        max-width: 100vh !important;
        border: unset !important;
        box-shadow: unset !important;
    }
}

@media (min-width: 640px) {
  .lemon-main {
    max-width: 768px!important;
    min-width: 390px!important;
    margin-left: auto;
    margin-right: auto;
  }
}

.lemon-footer{
    position: sticky;
    bottom: 12px;
    padding-right: .75rem;
    padding-left: 1rem;
    padding-top: 9px;
    padding-bottom: 9px;
    background-color:#fff;
    border:1px solid #0000000f;
    border-radius: .75rem;
    box-shadow: 0px 5px 16px 0px #00000014,0px 0px 1.25px 0px #0000000f;
    display: flex;
    justify-content: space-between;
}

:deep(.more-btn){
    display: none!important;
}
:deep(.share-btn){
    display: none!important;
}
</style>