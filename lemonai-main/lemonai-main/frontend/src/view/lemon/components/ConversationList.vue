<template>
  <div class="conversation-list">
    <div v-for="conversation in conversations" :key="conversation.id" class="conversation-item"
      :class="{ active: activeId === conversation.id }" @click="$emit('select', conversation.id)">
      <div class="conversation-title">{{ conversation.title }}</div>
      <div class="conversation-preview">{{ conversation.preview }}</div>
      <div class="conversation-date">{{ conversation.date }}</div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  conversations: {
    type: Array,
    default: () => []
  },
  activeId: {
    type: [Number, String],
    default: null
  }
})

defineEmits(['select'])
</script>

<style lang="scss" scoped>
.conversation-list {
  flex: 1;
  overflow-y: auto;
}

.conversation-item {
  padding: 12px 16px;
  cursor: pointer;
  border-bottom: 1px solid #f0f0f0;

  &:hover {
    background: #f5f5f5;
  }

  &.active {
    background: #e6f4ff;
  }
}

.conversation-title {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 4px;
}

.conversation-preview {
  font-size: 12px;
  color: #666;
  margin-bottom: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.conversation-date {
  font-size: 12px;
  color: #999;
}
</style>