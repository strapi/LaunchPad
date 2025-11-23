<template>
  <a-modal
    v-model:open="visible"
    :title="$t('setting.modelService.addProvider')"
    @ok="handleOk"
    @cancel="handleCancel"
    :maskClosable="false"
    :centered="true"
    :okText="$t('setting.modelService.confirm')"
    :cancelText="$t('setting.modelService.cancel')"
  >
    <div class="add-platform-form">
      <div class="platform-logo-upload" @click="triggerFileInput">
        <div v-if="!formData.logo_url" class="platform-letter" :style="{ backgroundColor: defaultColor }">
          P
        </div>
        <img v-else :src="formData.logo_url" :alt="$t('setting.modelService.platformLogo')" class="platform-logo" />
        <input
          type="file"
          ref="fileInput"
          style="display: none"
          accept="image/*"
          @change="handleFileChange"
        />
      </div>
      <a-form :model="formData" :rules="rules" ref="formRef">
        <a-form-item :label="$t('setting.modelService.providerName')" name="name">
          <a-input v-model:value="formData.name" :placeholder="$t('setting.modelService.namePlaceholder')" />
        </a-form-item>
        
        <a-form-item :label="$t('setting.modelService.providerType')" name="type" style="margin-left: 10px;">
          <a-select v-model:value="formData.provider_type" :placeholder="$t('setting.modelService.typePlaceholder')">
            <a-select-option value="openai">OpenAI</a-select-option>
            <!-- only support OpenAI -->
            <!-- <a-select-option value="gemini">Gemini</a-select-option>
            <a-select-option value="anthropic">Anthropic</a-select-option>
            <a-select-option value="azure">Azure OpenAI</a-select-option> -->
          </a-select>
        </a-form-item>
      </a-form>
    </div>
  </a-modal>
</template>

<script setup>
import { ref, defineEmits } from 'vue'
import { useI18n } from 'vue-i18n'
import service from '@/services/platforms'
import { message } from 'ant-design-vue'
import emitter from '@/utils/emitter'

const { t } = useI18n()
const emit = defineEmits(['add-platform'])
const visible = ref(false)
const fileInput = ref(null)
const formRef = ref(null)
const defaultColor = '#4ECDC4'

const formData = ref({
  name: '',
  provider_type: 'OpenAI',
  logo_url: '',
  source_type: 'user',
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
      // 
      const result = await loadImage();
      formData.value.logo_url = result;

      // print
      // console.log('Selected file:', file);
      // console.log('Form data:', formData.value);
    } catch (error) {
      // console.error('Error loading image:', error);
    }
  }
};

const handleOk = async () => {
  try {
    // await formRef.value.validate()
    service.insertPlatform(formData.value).then((res) => {
      // console.log(res)
      if(res.id !== undefined){
        message.success(t('setting.modelService.addPlatformSuccess'))
        emit('add-platform', res)
        emitter.emit('fresh-pages')
      }else{
        message.error(t('setting.modelService.addPlatformFailed'))
      }
      
    })
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
    name: '',
    provider_type: 'OpenAI',
    logo_url: '',
    source_type: 'user'
  }
  
  formRef.value?.resetFields()
}

const showModal = () => {
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


@media screen and (max-width: 768px) {
  .ant-form-item {
    div{
      margin-left: 0px!important;
    }
  }
}
</style>