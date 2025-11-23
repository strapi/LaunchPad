<template>
  <div class="confirm-prompt">
    <div class="confirm-content">
      <div class="confirm-icon">
        <span class="material-icon">📋</span>
      </div>
      <div class="confirm-message">{{ message }}</div>
      <div class="confirm-actions">
        <button class="action-button reject" @click="$emit('reject')">拒绝</button>
        <button class="action-button accept" @click="$emit('accept')">接受</button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  message: {
    type: String,
    default: ''
  }
})

defineEmits(['accept', 'reject'])
</script>

<style lang="scss" scoped>
.confirm-prompt {
  position: absolute;
  bottom: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  pointer-events: none;
}

.confirm-content {
  background: white;
  border-radius: 8px;
  padding: 16px;
  display: flex;
  align-items: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  max-width: 800px;
  width: 100%;
  margin: 0 20px;
  pointer-events: auto;
}

.confirm-icon {
  margin-right: 12px;
  color: #666;
}

.confirm-message {
  flex: 1;
  font-size: 14px;
  color: #333;
}

.confirm-actions {
  display: flex;
  gap: 8px;
}

.action-button {
  padding: 6px 16px;
  border-radius: 4px;
  font-size: 14px;
  border: none;
  cursor: pointer;

  &.reject {
    background: #f5f5f5;
    color: #333;

    &:hover {
      background: #e9e9e9;
    }
  }

  &.accept {
    background: #0066ff;
    color: white;

    &:hover {
      background: #0055dd;
    }
  }
}
</style>