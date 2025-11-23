<template>
  <a-modal
    v-model:open="visible"
    class="assistant-setting-modal"
    :title="$t('setting.defaultModel.assistantSettings')"
    @ok="handleOk"
    @cancel="handleCancel"
    :confirmLoading="confirmLoading"
    :okButtonProps="{ disabled: false }"
    :okText="$t('setting.defaultModel.confirm')"
    :cancelText="$t('setting.defaultModel.cancel')"
    :centered="true"
  >
  
    <a-form class="assistant-setting-form" layout="vertical">
      <!-- 助手名称 -->
      <a-form-item :label="$t('setting.defaultModel.assistantName')">
        <a-input
          v-model:value="config.assistant_name"
          :placeholder="$t('setting.defaultModel.assistantNamePlaceholder')"
        />
      </a-form-item>

      <!-- Prompt -->
      <a-form-item :label="$t('setting.defaultModel.prompt')">
        <a-textarea
          v-model:value="config.prompt"
          :rows="4"
          :placeholder="$t('setting.defaultModel.promptPlaceholder')"
        />
      </a-form-item>

      <!-- 模型参数标题 -->
      <p>{{ $t('setting.defaultModel.modelParameters') }}</p>

      <!-- Temperature -->
      <a-form-item :label="$t('setting.defaultModel.temperature')">
        <a-slider
          v-model:value="config.temperature"
          :min="0"
          :max="1"
          :step="0.01"
          :marks="{
            0: '0',
            0.5: '0.5',
            1: '1'
          }"
          style="width: 90%"
        />
      </a-form-item>

      <!-- Top P -->
      <a-form-item :label="$t('setting.defaultModel.topP')">
        <a-slider
          v-model:value="config.top_p"
          :min="0"
          :max="1"
          :step="0.01"
          :marks="{
            0: '0',
            0.5: '0.5',
            1: '1'
          }"
          style="width: 90%"
        />
      </a-form-item>

      <!-- Max Tokens -->
      <a-form-item :label="$t('setting.defaultModel.maxTokens')">
        <a-slider
          v-model:value="config.max_tokens"
          :min="1"
          :max="20"
          :step="1"
          :marks="{
            1: '1',
            5: '5',
            10: '10',
            15: '15',
            20: '20'
          }"
          style="width: 90%"
        />
      </a-form-item>

      <!-- Enable Length Limit -->
      <a-form-item :label="$t('setting.defaultModel.enableLengthLimit')">
        <a-switch v-model:checked="config.enable_length_limit" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup>
import { ref, reactive, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import emitter from '@/utils/emitter'

const { t } = useI18n()

// 👇 接收外部传入的 modelValue
const props = defineProps({
  modelValue: {
    type: Object,
    required: true
  }
})

// 👇 弹窗状态
const visible = ref(false)
const confirmLoading = ref(false)

// 👇 默认配置（原始常量用于重置）
const defaultConfig = {
  assistant_name: null,
  prompt: null,
  temperature: 1,
  top_p: 1,
  max_tokens: 5,
  enable_length_limit: false
}

// 👇 合并配置：优先使用 props.config，否则使用默认值
const initialConfig = props.modelValue?.config || {}

// 👇 响应式 config 对象，直接暴露给模板绑定
const config = reactive({
  ...defaultConfig,
  ...initialConfig
})

// 👇 监听 props 更新，同步到本地 config
watch(
  () => props.modelValue,
  (newVal) => {
    if (newVal && newVal.config) {
      const newConfig = newVal.config
      // 手动更新每个字段，保持响应性
      for (const key in defaultConfig) {
        config[key] = newConfig.hasOwnProperty(key) ? newConfig[key] : defaultConfig[key]
      }
    }
  },
  { deep: true, immediate: true }
)

// 👇 显示模态框
const showModal = () => {
  visible.value = true
}

// 👇 提交处理
const handleOk = () => {
  confirmLoading.value = true
  emitter.emit('default-assistant-setting-save', config)

  setTimeout(() => {
    visible.value = false
    confirmLoading.value = false
  }, 300)
}

// 👇 取消处理
const handleCancel = () => {
  visible.value = false
}

// 👇 暴露方法给父组件调用
defineExpose({ showModal })
</script>

<style scoped>
.ant-form-item {
  margin-bottom: 16px;
}
@media screen and (max-width: 768px) {
  .assistant-setting-form {
    height: 60vh !important;
  }
}
</style>