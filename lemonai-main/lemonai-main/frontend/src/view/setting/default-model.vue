<template>
  <div class="default-model">
    <h2>默认模型</h2>
    <div>
      <a-form :model="formState" layout="vertical" @finish="handleSubmit">
        <a-form-item label="自定义模型">
          <a-input v-model:value="formState.modelName" placeholder="例如: GPT-4" :disabled="loading" />
        </a-form-item>
        <a-form-item label="模型 URL">
          <a-input v-model:value="formState.modelUrl" placeholder="https://api.example.com/v1" :disabled="loading" />
        </a-form-item>
        <a-form-item label="API Key">
          <a-input-password v-model:value="formState.apiKey" placeholder="输入您的API密钥" :disabled="loading" />
        </a-form-item>
        <a-form-item>
          <a-button type="primary" html-type="submit" :loading="loading">保存设置</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { message } from 'ant-design-vue'
import settingService from '@/services/setting'

const temperature = ref(0.7)
const formState = reactive({
  modelName: '',
  modelUrl: '',
  apiKey: ''
})
const loading = ref(false)

// Fetch settings on mount
onMounted(async () => {
  try {
    const settings = await settingService.get()
    Object.assign(formState, settings)
  } catch (error) {
    message.error('获取设置失败')
  } finally {
  }
})

// Save settings
const handleSubmit = async () => {
  try {
    loading.value = true
    await settingService.save(formState)
    message.success('设置保存成功')
  } catch (error) {
    message.error('保存设置失败')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.default-model {
  padding: 16px;
}
.model-card {
  margin: 16px 0;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}
</style>