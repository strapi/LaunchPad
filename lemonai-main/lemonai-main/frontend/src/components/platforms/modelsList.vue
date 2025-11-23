<template>
  <div class="platform-model-container">
    <div class="model-header">
      <span>{{ $t('setting.modelService.models') }}</span>
    </div>
    <div class="models-list">
      <div v-for="group in groupedModels" :key="group.name" class="model-group">
        <div class="group-header" @click="toggleGroup(group.name)">
          <span class="group-toggle">
            <DownOutlined v-if="groupStates[group.name]"/>
            <RightOutlined v-else/>
          </span>
          <span class="group-name">{{ group.name }}</span>
        </div>
        <div class="model-items" :class="{ 'collapsed': !groupStates[group.name] }">
          <div v-for="model in group.models" :key="model.id" class="model-item">
            <div class="model-logo">
              <div v-if="model.logo_url" class="logo-image">
                <img :src="model.logo_url" alt="logo">
              </div>
              <div v-else class="logo-letter" :style="{ backgroundColor: getRandomColor(model.model_id) }">
                {{ model.model_id.charAt(0) }}
              </div>
            </div>
            <div class="model-info">
              <a-popover>
                <template #content>
                  <div
                      style="display: flex; flex-direction: row; justify-items: center; align-items: center; gap: 5px;">
                    <span style="display: flex; justify-content: center; align-content: center;">{{
                        model.model_name
                      }}</span>
                    <component
                        :is="copyState[model.model_id]?.isCopied ? CheckOutlined : SnippetsOutlined"
                        style="align-items: center;"
                        @click="copyModelName(model.model_id, model.model_name)"
                    />
                  </div>
                </template>
                <span class="model-name">{{ model.model_name }}</span>
              </a-popover>

              <div class="model-type" v-for="type in model.model_types" :key="type">
                <a-popover>
                  <template #content>
                    <div style="display: flex; flex-direction: row; justify-items: center; align-items: center;">
                      <span>{{ type }}</span>
                    </div>
                  </template>
                  <component
                      :is="typeIconMap[type]?.component"
                      v-if="typeIconMap[type]"
                      :class="typeIconMap[type]?.class"
                      class="type-icon"
                  />
                </a-popover>
              </div>
            </div>
            <div class="model-actions"  v-if="!is_subscribe">
              <setting-outlined class="action-icon" @click.stop="handleModelSetting(model)"/>
              <minus-outlined class="action-icon" @click.stop="handleModelDelete(model)"/>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="model-more-detail">
      <span>{{ $t('setting.modelService.viewOfficialDocs') }}</span>
    </div>
    <div v-if="!is_subscribe">
      <a-button type="primary" class="addmodel" @click="handleModelSetting()">
        <PlusOutlined/>
        {{ $t('setting.modelService.add') }}
      </a-button>
    </div>
    <!-- 集成 ModelInfo 组件 -->
    <model-info :platform_id="props.platform_id" ref="modelInfoRef"/>
  </div>
</template>

<script setup>
import {computed, ref, h, onMounted} from 'vue';
import {useI18n} from 'vue-i18n';
import {
  SettingOutlined,
  MinusOutlined,
  PlusOutlined,
  DownOutlined,
  RightOutlined,
  SnippetsOutlined,
  CheckOutlined,
  ToolOutlined,
  GlobalOutlined,
  BranchesOutlined,
  CameraOutlined
} from '@ant-design/icons-vue';
import {message} from 'ant-design-vue';
import ModelInfo from '@/components/platforms/modelinfo.vue';
import service from '@/services/platforms';
import emitter from '@/utils/emitter';

const {t} = useI18n();

const props = defineProps({
  models: {
    type: Array,
    default: () => []
  },
  platform_id: {
    type: Number,
    default: -1
  },
  is_subscribe:{
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['setting', 'delete', 'add-model', 'update-model']);
const groupStates = ref({});
const modelInfoRef = ref(null);
const copyState = ref({}); // 存储每个 model 的复制状态，键为 model_id

const groupedModels = computed(() => {
  const groups = {};
  props.models.forEach(model => {
    const groupName = model.group_name || t('setting.modelService.ungrouped');
    if (!groups[groupName]) {
      groups[groupName] = {
        name: groupName,
        models: []
      };
      if (groupStates.value[groupName] === undefined) {
        groupStates.value[groupName] = true;
      }
    }
    groups[groupName].models.push(model);
  });
  return Object.values(groups);
});

const toggleGroup = (groupName) => {
  groupStates.value[groupName] = !groupStates.value[groupName];
};


const modelColors = ref({});
const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD', '#D4A5A5', '#9B59B6', '#3498DB'];

const getRandomColor = (modelId) => {
  if (!modelColors.value[modelId]) {
    const index = Math.abs(modelId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % colors.length;
    modelColors.value[modelId] = colors[index];
  }
  return modelColors.value[modelId];
};

const handleModelSetting = (model = null) => {
  modelInfoRef.value.showModal(model);
  emit('setting', model);
};

const handleModelDelete = async (model) => {
  try {
    await service.deleteModel(model.id);
    emitter.emit('fresh-models');
    message.success(t('setting.modelService.deleteModelSuccess'));
  } catch (error) {
    console.error('Failed to delete model:', error);
    message.error(t('setting.modelService.deleteModelFailed'));
  }
};

const typeIconMap = {
    ['tool']: {
      component: ToolOutlined,
      class: 'type-tool'
    },
    ['network']: {
      component: GlobalOutlined,
      class: 'type-network'
    },
    ['embed']: {
      component: () => h('div', {}, 'em'),
      class: 'type-embed'
    },
    ['reasoning']: {
      component: BranchesOutlined,
      class: 'type-reasoning'
    },
    ['vision']: {
      component: CameraOutlined,
      class: 'type-vision'
    }
  };

onMounted(() => {
});

const handleAddModel = (response) => {
  // message.success(t('setting.modelService.addModelSuccess'));
  // emit('add-model', response);
};

const handleUpdateModel = (response) => {
  // message.success(t('setting.modelService.updateModelSuccess'));
  emit('update-model', response);
};

const copyModelName = (modelId, modelName) => {
  navigator.clipboard.writeText(modelName).then(() => {
    copyState.value[modelId] = {isCopied: true};
    message.success(t('setting.modelService.copySuccess'));
    setTimeout(() => {
      copyState.value[modelId] = {isCopied: false};
    }, 2000);
  }).catch((err) => {
    console.error('Failed to copy:', err);
    message.error(t('setting.modelService.copyFailed'));
  });
};
</script>

<style scoped>
.model-header {
  margin-top: 20px;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  font-size: 16px;
  font-weight: 500;
  font-weight: bold;
}

.models-h {
  align-items: center;
  margin-left: 16px;
}

.models-list {
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(255, 255, 255, 0.09);
}

.model-group {
  margin-bottom: 10px;
  border-radius: 6px;
  border: #d1d1d1 solid 1px;
  overflow: hidden
}

.group-header {
  display: flex;
  align-items: center;
  cursor: pointer;
  background-color: #f5f5f5;
  padding: 12px;
  gap: 12px;
}

.group-name {
  font-size: 13px;
  font-weight: 500;
  color: #202020;
  font-weight: bold;
}

.group-toggle {
  font-size: 14px;
  color: #a4a2a2;
  transition: transform 0.6s;
}

.group-toggle.expanded {
  transform: rotate(180deg);
  border-bottom: #666 solid 1px;
}

.model-items {
  transition: max-height 0.6s ease-in-out, opacity 0.6s ease-in-out;
  opacity: 1;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.model-items.collapsed {
  max-height: 0;
  opacity: 0;
  margin: 0;
  padding: 0;
}

.model-item {
  display: flex;
  align-items: center;
  background: #fff;
  transition: all 0.3s;
  padding: 12px;
  gap: 12px;
}

.logo-image img {
  width: 32px;
  height: 32px;
  border-radius: 4px;
}

.logo-letter {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: bold;
}

.model-info {
  flex: 1;
  display: flex;
  flex-direction: row;
  gap: 10px;
  align-items: center;
}

.model-name {
  font-size: 14px;
  color: #333;
}

.model-type {
  font-size: 12px;
  color: #666;
}

.model-actions {
  display: flex;
  gap: 8px;
}

.action-icon {
  color: #2f2f2f;
  cursor: pointer;
  padding: 4px;
}

.action-icon:hover {
  color: #1890ff;
}

.platform-model-container {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.addmodel {
  margin-top: 10px;
  background-color: #ffffff;
  border: #c5c5c5 solid 1px;
  font-size: smaller;
  color: #000;
  box-shadow: none;
}

.addmodel:hover {
  background-color: #f5f5f5;
  color: #000;
}

.model-more-detail {
  margin-top: 10px;
  color: #999;
  font-size: 12px;
}

.type-icon {
  height: 18px;
  width: 25px;
  border-radius: 7px;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
}

.type-tool {
  background-color: #ffe1ce;
  color: #a07b64;
}

.type-network {
  background-color: #b1d7f4;
  color: #537fa1;
}

.type-embed {
  background-color: #f3d4a5;
  color: #917142;
}

.type-reasoning {
  background-color: #b0bac9;
  color: #51617d;
}

.type-vision {
  background-color: #c9f6d3;
  color: #54b46a;
}
</style>
