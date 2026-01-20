<template>
  <div class="action">
    <span>{{ thought }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const actionTypeDescriptions = {
  'run': '执行 bash 命令',
  'read': '读取文件',
  'edit': '编辑文件',
  'browser':  '使用浏览器',
}

const props = defineProps({
  message: {
    type: Object,
    required: true
  }
})

const thought = computed(() => {
  const value = props.message.message
  return  value ||props.message.args.thought 
})

const actionType = computed(() => {
  const action = props.message.action;
  return actionTypeDescriptions[action]
})

const content = computed(() => {
  const action = props.message.action;
  if (action === 'run') {
    return props.message.args.command
  }
  if (action === 'read') {
    return props.message.args.path
  }
  if (action === 'edit') {
    return props.message.args.path
  }
  return ''
})

</script>

<style lang="scss" scoped></style>
