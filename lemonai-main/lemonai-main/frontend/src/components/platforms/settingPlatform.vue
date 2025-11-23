<template>
  <a-modal
    v-model:open="visible"
    :maskClosable="false"
    :centered="true"
    :okText="$t('setting.modelService.confirm')"
    :cancelText="$t('setting.modelService.cancel')"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <template #title>
      <div style="display: flex; align-items: center; justify-content: start;">
        <span>{{ $t('setting.modelService.editProvider') }}</span>
        <a-button type="text" danger class="delete-button">
          <delete-outlined @click="handleDelete"/>
        </a-button>
      </div>
    </template>

    <div class="add-platform-form">
      <div class="platform-logo-upload" @click="triggerFileInput">
        <div v-if="!formData.logo_url" class="platform-letter" :style="{ backgroundColor: defaultColor }">
          {{ formData.name ? formData.name.charAt(0) : 'P' }}
        </div>
        <img v-else :src="formData.logo_url" :alt="$t('setting.modelService.platformLogo')" class="platform-logo" />
        <input type="file" ref="fileInput" style="display: none" accept="image/*" @change="handleFileChange" />
      </div>

      <a-form :model="formData" :rules="rules" ref="formRef">

        <a-form-item :label="$t('setting.modelService.providerName')" name="name">
          <a-input v-model:value="formData.name" :placeholder="$t('setting.modelService.namePlaceholder')" />
        </a-form-item>

        <a-form-item :label="$t('setting.modelService.providerType')" name="type" style="margin-left:10px;">
          <!-- <a-select v-model:value="formData.provider_type"> -->
          <a-select v-model:value="OpenAI">
            <a-select-option value="OpenAI">OpenAI</a-select-option>
          </a-select>
        </a-form-item>


      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import { DeleteOutlined } from '@ant-design/icons-vue'
import service from '@/services/platforms'
import { message } from 'ant-design-vue'
import emitter from '@/utils/emitter'

const { t } = useI18n()
const emit = defineEmits(['update-platform'])
const visible = ref(false)
const fileInput = ref(null)
const formRef = ref(null)
const defaultColor = '#4ECDC4'
const OpenAI = ref('OpenAI')
const formData = ref({
  id: '',
  name: '',
  provider_type: '',
  logo_url: '',
  source_type: 'user',
  api_key: '',
  api_url: '',
  api_version: '',
  is_enabled: true,
  activate_time: -1,
  key_obtain_url: ''
})

const rules = {
  name: [
    { required: true, message: t('setting.modelService.enterName'), trigger: 'blur' }
  ],
  provider_type: [
    { required: true, message: t('setting.modelService.selectType'), trigger: 'change' }
  ]
}

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleFileChange = async (e) => {
  const file = e.target.files[0];
  if (file) {
    // 检查文件是否为图片格式
    const validImageTypes = ['image/png', 'image/jpeg', 'image/gif', 'image/webp'];
    if (!validImageTypes.includes(file.type)) {
      console.error('Invalid file type. Please select an image (PNG, JPEG, GIF, or WebP).');
      return;
    }

    // 使用 Promise 包装 FileReader
    const loadImage = () => {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          resolve(e.target.result);
        };
        reader.onerror = (error) => {
          reject(error);
        };
        reader.readAsDataURL(file);
      });
    };

    try {
      // 等待图片加载完成
      const result = await loadImage();
      formData.value.logo_url = result;

      // 图片加载完成后再打印
      console.log('Selected file:', file);
      console.log('Form data:', formData.value);
    } catch (error) {
      console.error('Error loading image:', error);
    }
  }
};

const handleOk = async () => {
  try {
    await formRef.value.validate()
    service.updatePlatform(formData.value).then((res) => {
      emit('update-platform', res)
      emitter.emit('fresh-pages')
      message.success(t('setting.modelService.updatePlatformSuccess'))
    })
    visible.value = false
  } catch (error) {
    // console.error('Form validation failed:', error)
    // message.error(t('setting.modelService.formValidationFailed'))
  }
}

const handleCancel = () => {
  visible.value = false
}

const handleDelete = async () => {
  try {
    // console.log(formData.value.id)
    const res = await service.deletePlatform(formData.value.id)
    console.log(res)
    if(res.code===0){
      message.success(t('setting.modelService.deletePlatformSuccess'))
    }
    visible.value = false
    emitter.emit('fresh-pages')
    
  } catch (error) {
    console.error('Failed to delete platform:', error)
    // message.error(t('setting.modelService.deletePlatformFailed'))
  }
}

const showModal = (platform) => {
  formData.value = { ...platform }
  visible.value = true
}

defineExpose({
  showModal
})
</script>

<style scoped>
.add-platform-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
}

.platform-logo-upload {
  width: 80px;
  height: 80px;
  border-radius: 8px;
  margin-bottom: 24px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px dashed #d9d9d9;
}

.platform-logo-upload:hover {
  border-color: #40a9ff;
}

.platform-letter {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 32px;
  font-weight: bold;
}

.platform-logo {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

:deep(.ant-form) {
  width: 100%;
}

:deep(.ant-form-item) {
  margin-bottom: 16px;
}

.delete-button{
  margin-left: 5px;

}
</style>