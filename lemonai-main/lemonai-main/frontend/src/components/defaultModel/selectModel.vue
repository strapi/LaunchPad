<template>
  <div class="select-model">
    <a-select
      v-model:value="selectedModel"
      style="width: 97% "
      :placeholder= "t('setting.defaultModel.emptymodelTips')" 
      :disabled="!hasModels"
      class="select_model_ed"
    >
      <a-select-opt-group v-for="group in groupedModels" :key="group.name" :label="group.name">
        <a-select-option
          v-for="model in group.models"
          :key="model.id"
          :value="model.name"
        >
          {{ model.model_name }} | {{ model.group_name }}
        </a-select-option>
      </a-select-opt-group>
    </a-select>
  </div>
</template>

<script setup>
import { ref, computed, watch, defineProps } from 'vue'
import emitter from '@/utils/emitter'
import { useI18n } from 'vue-i18n'
const { t } = useI18n();
const props = defineProps({
  platform_models: {
    type: Array,
    default: () => []
  },
  model_choose: {
    type: Number,
    default: () => 0
  },
  select_type: {
    type: String,
    default: () => 'assistant'
  }
})

const hasModels = computed(() => {
  return Array.isArray(props.platform_models) && props.platform_models.length > 0
})

const selectedModel = ref(hasModels.value ? props.model_choose : null)

watch(() => props.model_choose, (newValue) => {
  if (hasModels.value) {
    selectedModel.value = newValue
  }
})

const groupedModels = computed(() => {
  /**
   * result: [
   *   {
   *     name: 'platform_name',
   *     models: [
   *       {
   *         id: 'model_id',
   *         model_name: 'model_name',
   *         group_name: 'group_name'
   *       }
   *     ]
   *   }
   * ]
   */
  const result = [];
  if (hasModels.value) {
    for (const item of props.platform_models) {
      // 查找是否已经有这个 platform_name 的组
      let group = result.find(group => group.name === item.platform_name);
      // 如果没有找到，则新建一个组并加入结果数组
      if (!group) {
        group = {
          name: item.platform_name,
          models: []
        };
        result.push(group);
      }
      // 将当前模型加入对应的组中
      group.models.push({
        id: item.id,
        model_name: item.model_name,
        group_name: item.group_name,
        model_id: item.model_id,
        // 你可以根据需要选择性地添加其他字段
      });
    }
  }

  return result;
});

watch(selectedModel, async (newValue) => {
  if (newValue) {
    emitter.emit(`default-model-changed`, {
      setting_type: props.select_type,
      model_id: Number(newValue)
    })
  }
})
</script>

<style scoped>
.select-model {
  width: 90%;
  height: 100%;
}
</style>