<template>
  <div class="message-content" :class="messageType">
    <Message :message="message" />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import Observation from './Observation.vue';
import Action from './Action.vue';
import Message from './Message.vue';


const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const messageType = computed(() => {
  const message = props.message;
  if (message.action === 'message') {
    return 'message'
  }
  if (message.observation) {
    return 'observation'
  }
  if (message.action) {
    return 'action'
  }
  return ''
});


</script>

<style lang="scss" scoped>
.message-content {
  padding: .75rem;
  position: relative;
  word-wrap: break-word;
  overflow-wrap: break-word;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  &.action,
  &.observation {
    border: none;
    box-shadow: none;
    background: transparent;
    max-width: calc(100% - 16px);
    padding-left: 0;
    padding: 0;
  }

  &:hover {
    // padding-right: 40px;

    .copy-button {
      display: block;
    }
  }
}

.message-sender {
  font-size: 14px;
  font-weight: 500;
  color: #1f2329;
  margin-bottom: 4px;
}

.message-text {
  font-size: 14px;
  color: #1f2329;
  line-height: 1.5;
  white-space: pre-wrap;
}

.message-time {
  font-size: 12px;
  color: #999;
  margin-top: 4px;
}


</style>