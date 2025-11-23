<template>
    <a-modal
      class="topic-naming"
      v-model:open="visible"
      :title="$t('setting.defaultModel.topicNamingSettings')"
      @ok="handleOk"
      @cancel="handleCancel"
      :confirmLoading="confirmLoading"
      :okButtonProps="{ disabled: false }"
      :centered="true"
      :okText="$t('setting.defaultModel.confirm')"
      :cancelText="$t('setting.defaultModel.cancel')"
    >
      <a-form :model="formState" layout="vertical">
        <a-form-item :label="$t('setting.defaultModel.topicAutoNaming')">
          <a-switch v-model:checked="formState.config.auto_naming" />
        </a-form-item>
        <a-form-item :label="$t('setting.defaultModel.topicNamingPrompt')">
          <a-textarea
            v-model:value="formState.config.prompt"
            :rows="4"
            :placeholder="$t('setting.defaultModel.promptPlaceholder')"
          />
        </a-form-item>
      </a-form>
    </a-modal>
  </template>
  
  <script setup>
  import { ref, reactive, watch, computed } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { message } from 'ant-design-vue'
  import emitter from '@/utils/emitter'
  
  const { t } = useI18n()
  
  const props = defineProps({
    modelValue: {
      type: Object,
      required: true
    }
  })
  
  const visible = ref(false)
  const confirmLoading = ref(false)
  
  const formState = reactive({
    config: {
      prompt: '',
      auto_naming: false
    },
    originalConfig: null
  })
  
  const hasChanges = computed(() => {
    if (!formState.originalConfig) return false
    return JSON.stringify(formState.config) !== JSON.stringify(formState.originalConfig)
  })
  
  watch(() => props.modelValue, (newVal) => {
    if (newVal && newVal.config) {
      Object.assign(formState.config, newVal.config)
      formState.originalConfig = JSON.parse(JSON.stringify(newVal.config))
    }
  }, { deep: true })
  
  const showModal = () => {
    visible.value = true
  }
  
  const handleOk = () => {
    confirmLoading.value = true
    emitter.emit('default-topic_naming-setting-save', formState.config)
    setTimeout(() => {
      visible.value = false
      confirmLoading.value = false
    }, 1000)
  }
  
  const handleCancel = () => {
    visible.value = false
  }
  
  defineExpose({
    showModal
  })
  </script>
  
  <style scoped>
  </style>