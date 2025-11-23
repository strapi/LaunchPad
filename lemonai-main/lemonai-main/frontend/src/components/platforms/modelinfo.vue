<template>
  <a-modal
    v-model:open="visible"
    :title="isEdit ? $t('setting.modelService.editModel') : $t('setting.modelService.addModel')"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :centered="true"
    :okText="$t('setting.modelService.confirm')"
    :cancelText="$t('setting.modelService.cancel')"
  >
    <div class="model-form">
      <a-form :model="formData" :rules="rules" ref="formRef">
        <a-form-item :label="$t('setting.modelService.modelId')" name="model_id" style="display: flex; justify-content: end">
          <a-input 
            v-model:value="formData.model_id" 
            :placeholder="$t('setting.modelService.modelIdPlaceholder')" 
            :disabled="isEdit"
          />
        </a-form-item>
        
        <a-form-item :label="$t('setting.modelService.modelName')" name="model_name">
          <a-input v-model:value="formData.model_name" :placeholder="$t('setting.modelService.modelNamePlaceholder')" />
        </a-form-item>

        <a-form-item :label="$t('setting.modelService.groupName')" name="group_name">
          <a-input v-model:value="formData.group_name" :placeholder="$t('setting.modelService.groupNamePlaceholder')" />
        </a-form-item>

        <div class="more-options">
          <a @click="toggleModelTypes" class="toggle-link">
            {{ showModelTypes ? $t('setting.modelService.hideOptions') : $t('setting.modelService.showMoreOptions') }}
          </a>
        </div>

        <a-form-item
          v-if="showModelTypes"
          :label="$t('setting.modelService.modelTypes')"
          name="model_types"
          class="model-types-item"
        >
          <a-checkbox-group v-model:value="formData.model_types" class="model-type-group">
            <a-checkbox class="checkbox-item" value="vision">
              {{ $t('setting.modelService.typeVision') }}
            </a-checkbox>
            <a-checkbox class="checkbox-item" value="network">
              {{ $t('setting.modelService.typeNetwork') }}
            </a-checkbox>
            <a-checkbox class="checkbox-item" value="embed">
              {{ $t('setting.modelService.typeEmbed') }}
            </a-checkbox>
            <a-checkbox class="checkbox-item" value="tool">
              {{ $t('setting.modelService.typeTool') }}
            </a-checkbox>
            <a-checkbox class="checkbox-item" value="reasoning">
              {{ $t('setting.modelService.typeReasoning') }}
            </a-checkbox>
          </a-checkbox-group>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, defineProps } from 'vue'
import { useI18n } from 'vue-i18n'
import service from '@/services/platforms'
import { message } from 'ant-design-vue'
import emitter from '@/utils/emitter'

const { t } = useI18n()
const visible = ref(false)
const formRef = ref(null)
const isEdit = ref(false)
const showModelTypes = ref(false) // 控制 model_types 显示/隐藏

const props = defineProps({
  platform_id: {
    type: Number,
    default: -1
  }
})

const formData = ref({
  model_id: '',
  model_name: '',
  group_name: '',
  model_types: [],
  platform_id: -1,
  logo_url: ''
})

const rules = {
  model_id: [
    { required: true, message: t('setting.modelService.enterModelId'), trigger: 'blur' }
  ],
  model_name: [
    { required: false, message: t('setting.modelService.enterModelName'), trigger: 'blur' }
  ],
  group_name: [
    { required: false, message: t('setting.modelService.enterGroupName'), trigger: 'blur' }
  ],
  model_types: [
    {
      required: false,
      type: 'array',
      message: t('setting.modelService.selectModelType'),
      trigger: 'change',
      // validator: (_, value) => {
      //   if (!showModelTypes.value) return Promise.resolve(); // 跳过隐藏时的验证
      //   return value && value.length > 0 ? Promise.resolve() : Promise.reject();
      // }
    }
  ]
}

const handleOk = async () => {
  try {
    await formRef.value.validate()
    if (isEdit.value) {
      await service.updateModel(formData.value)
      emitter.emit('fresh-models', true)
      message.success(t('setting.modelService.updateModelSuccess'))
    } else {
      formData.value.platform_id = props.platform_id
      const res = await service.insertModel(formData.value)
      // console.log(res)
      // Model already exists
      if(res.code === 1){
        message.error(t('setting.modelService.modelAlreadyExists'))
        return
      }
      emitter.emit('fresh-models', res)
      message.success(t('setting.modelService.addModelSuccess'))
    }
    visible.value = false
    resetForm()
  } catch (error) {
    console.error('Form validation failed:', error)
    message.error(t('setting.modelService.formValidationFailed'))
  }
}

const handleCancel = () => {
  visible.value = false
  resetForm()
}

const resetForm = () => {
  formData.value = {
    model_id: '',
    model_name: '',
    group_name: '',
    model_types: [],
    platform_id: props.platform_id,
    logo_url: ''
  }
  showModelTypes.value = false // 重置时隐藏 model_types
  formRef.value?.resetFields()
}

const showModal = (model = null) => {
  if (model) {
    isEdit.value = true
    formData.value = {
      ...model,
      model_name: model.model_name || '',
      model_types: model.model_types || [],
      platform_id: model.platform_id || props.platform_id,
    }
  } else {
    isEdit.value = false
    resetForm()
  }
  visible.value = true
}

const toggleModelTypes = () => {
  showModelTypes.value = !showModelTypes.value
}

defineExpose({
  showModal
})
</script>

<style scoped>
.model-form {
  padding: 6px;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

.model-type-group {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(70px, 1fr));
  gap: 8px; /* 间距缩小 */
  width: 100%;
}

.checkbox-item {
  display: flex;
  align-items: center;
  padding: 4px 2px; /* 减小内边距 */
  border-radius: 4px;
  transition: background-color 0.2s;
}

.checkbox-item:hover {
  background-color: #f5f5f5;
}

:deep(.ant-checkbox-wrapper) {
  margin: 0;
}

:deep(.ant-checkbox-checked .ant-checkbox-inner) {
  background-color: #1890ff;
  border-color: #1890ff;
}

.model-types-item {
  align-items: start;
}

.more-options {
  margin-bottom: 16px;
}

.toggle-link {
  color: #9f9f9f;
  cursor: pointer;
  font-size: 14px;
  transition: color 0.2s;
}

.toggle-link:hover {
  color: #40a9ff;
}
</style>