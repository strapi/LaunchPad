<template>
    <div class="default-model-container">
        <!-- 助手模型 -->
        <div class="default-item assistant-container">

            <div class="item-header item">
                <p class="item-title">{{ $t('setting.defaultModel.defaultAssistantModel') }}</p>
            </div>

            <div class="item-model item">
                <selectModel class="select_model" :platform_models="platform_models"
                    :model_choose="assistant_model_number" :select_type="assistant_model.setting_type"/>
                <div class="assistant setting">
                    <SettingOutlined class="icon" @click="handleAssistantSetting" />
                </div>
            </div>

            <div class="item-tips item">
                <p>{{ $t('setting.defaultModel.assistantModelTips') }}</p>
            </div>

        </div>
        <!-- 命名模型 -->
        <div class="default-item topic-naming-contianer">

            <div class="item-header item">
                <p class="item-title">{{ $t('setting.defaultModel.topicNamingModel') }}</p>
            </div>

            <div class="item-model item">
                <selectModel class="select_model" :platform_models="platform_models"
                    :model_choose="topic_naming_model_number" :select_type="topic_naming_model.setting_type" />
                <div class="topic_naming setting">
                    <SettingOutlined class="icon" @click="handleTopicNamingSetting" />
                </div>
            </div>

            <div class="item-tips item">
                <p>{{ $t('setting.defaultModel.topicNamingModelTips') }}</p>
            </div>
        </div>
        <!-- 翻译模型 -->
<!--        <div class="default-item translation-contianer">-->

<!--            <div class="item-header item">-->
<!--                <p class="item-title">{{ $t('setting.defaultModel.translationModel') }}</p>-->
<!--            </div>-->
<!--            <div class="item-model item">-->
<!--                <selectModel class="select_model" :platform_models="platform_models"-->
<!--                    :model_choose="translation_model_number" :select_type="translation_model.setting_type" />-->
<!--                <div class="translation setting">-->
<!--                    <SettingOutlined class="icon" @click="handleTranslationSetting" />-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="item-tips item">-->
<!--                <p>{{ $t('setting.defaultModel.translationModelTips') }}</p>-->
<!--            </div>-->
<!--        </div>-->
<!--        <div class="default-item browser-use-contianer">-->

<!--            <div class="item-header item">-->
<!--                <p class="item-title">{{ $t('setting.defaultModel.browserUseModel') }}</p>-->
<!--            </div>-->
<!--            <div class="item-model item">-->
<!--                <selectModel class="select_model" :platform_models="platform_models"-->
<!--                    :model_choose="browser_use_model_number" :select_type="browser_use_model.setting_type" />-->
<!--                <div class="browser-use setting">-->
<!--                    <SettingOutlined class="icon" @click="handleTranslationSetting" />-->
<!--                </div>-->
<!--            </div>-->
<!--            <div class="item-tips item">-->
<!--                <p>{{ $t('setting.defaultModel.browserUseModelTips') }}</p>-->
<!--            </div>-->
<!--        </div>-->
    </div>

    <assistantSetting ref="assistantSettingRef" :model-value="assistant_model" />
    <topicNamingSetting ref="topicNamingSettingRef" :model-value="topic_naming_model" />
    <translationSetting ref="translationSettingRef" :model-value="translation_model" />


</template>

<script setup>
import selectModel from './selectModel.vue'
import assistantSetting from './assistantSetting.vue'
import topicNamingSetting from './TopicNaming.vue'
import translationSetting from './translation.vue'
import { ref, onMounted, onBeforeMount, onUnmounted,nextTick } from 'vue'
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
import service from '@/services/default-model-setting'
import emitter from '@/utils/emitter'
import { message } from 'ant-design-vue'
import { SettingOutlined } from '@ant-design/icons-vue'
import { driver } from "driver.js";
import "driver.js/dist/driver.css";


// 定义相关变量
const platform_models = ref([])
const assistant_model_number = ref(Number())
const topic_naming_model_number = ref(Number())
const translation_model_number = ref(Number())
const browser_use_model_number = ref(Number())


const assistant_model = ref({
    setting_type: 'assistant',
    config: {
        assistant_name: null,
        prompt: null,
        temperature: 1,
        top_p: 1,
        max_tokens: 5,
        enable_length_limit: false
    },
    model_id: Number()
})
const topic_naming_model = ref({
    setting_type: 'topic-naming',
    config: {
        auto_naming: false,
        prompt: ''
    },
    model_id: Number()
})
const translation_model = ref({
    setting_type: 'translation',
    config: {
        prompt: ''
    },
    model_id: Number()
})
const browser_use_model = ref({
    setting_type: 'browser-use',
    config: {
        
    },
    model_id: Number()
})


//子组件引用
const assistantSettingRef = ref()
const topicNamingSettingRef = ref()
const translationSettingRef = ref()
// 助手模型设置
const handleAssistantSetting = () => {
    assistantSettingRef.value.showModal()
}
// 命名模型设置
const handleTopicNamingSetting = () => {
    topicNamingSettingRef.value.showModal()
}
// 翻译模型设置
const handleTranslationSetting = () => {
    translationSettingRef.value.showModal()
}

const handleBrowserSetting = () => {

}
onBeforeMount(async () => {
    const res = await service.getModels()
    platform_models.value = res
    const modelsSettings = await service.getModelBySetting()
    modelsSettings.forEach((model) => {
        if (model.setting_type === 'assistant') {
            assistant_model.value = model
            assistant_model_number.value = model.model_id
        }
        if (model.setting_type === 'topic-naming') {
            topic_naming_model.value = model
            topic_naming_model_number.value = model.model_id
        }
        if (model.setting_type === 'translation') {
            translation_model.value = model
            translation_model_number.value = model.model_id
        }
        if (model.setting_type === 'browser-use') {
            browser_use_model.value = model
            browser_use_model_number.value = model.model_id
        }
    })
})




let tourDriver = null; // 提升作用域，并初始化为空

const step1 = async () => {
  tourDriver = driver({
    animate: true,
    showProgress: true,
    prevBtnText: t('setting.prevStep'),
    nextBtnText: t('setting.nextStep'),
    doneBtnText: t('setting.doneStep'),
    steps: [
      {
        element: '.assistant-container',
        popover: {
          side: 'bottom',
          title: t('setting.defaultModel.defaultAssistantModel'),
          description: t('setting.defaultModel.assistantModelTips'),
          onNextClick: async () => {
            nextTick(() => { 
              tourDriver.moveNext();
            });
          },
        }
      },
      {
        element: '.topic-naming-contianer',
        popover: {
          side: 'bottom',
          title: t('setting.defaultModel.topicNamingModel'),
          description: t('setting.defaultModel.topicNamingModelTips'),
          onNextClick: async () => {
            nextTick(() => { 
              // 设置缓存，结束引导
              localStorage.setItem('tour_end', 'true');
              localStorage.setItem('tour', 'false');
              tourDriver.moveNext();
            });
          },
        }
      }
    ]
  });

  tourDriver.drive();
};

onMounted(async () => {
    // localStorage.setItem('tour', 'true');
    if (localStorage.getItem('tour') === 'true' && localStorage.getItem('tour_end') !== 'true') {
        step1();
    }
    emitter.on('default-assistant-setting-save', (model_config) => {
        assistant_model.value.config = model_config
        console.log(assistant_model.value);
        service.updateModel(assistant_model.value).then((res) => {
            message.success(t('setting.defaultModel.saveSuccess'))
        })
    })

    emitter.on('default-topic_naming-setting-save', (model_config) => {
        topic_naming_model.value.config = model_config
        service.updateModel(topic_naming_model.value).then((res) => {
            message.success(t('setting.defaultModel.saveSuccess'))
        })
    })

    emitter.on('default-translation-setting-save', (model_config) => {
        translation_model.value.config = model_config
        service.updateModel(translation_model.value).then((res) => {
            message.success(t('setting.defaultModel.saveSuccess'))
        })
    })


    emitter.on('default-model-changed', (newValue) => {
        const setting_type = newValue.setting_type
        // str => int
        const model_id = newValue.model_id
        // const model_id = newValue.model_id
        //更新
        if (setting_type === 'assistant') {
            assistant_model_number.value = model_id
            assistant_model.value.model_id = model_id
            // console.log(assistant_model.value);

            service.updateModel(assistant_model.value).then((res) => {
            })
        } else if (setting_type === 'topic-naming') {
            topic_naming_model_number.value = model_id
            topic_naming_model.value.model_id = model_id

            service.updateModel(topic_naming_model.value).then((res) => {

            })
        }
        else if (setting_type === 'translation') {
            translation_model_number.value = model_id
            translation_model.value.model_id = model_id
            service.updateModel(translation_model.value).then((res) => {

            })
        }else if (setting_type === 'browser-use') {
            browser_use_model_number.value = model_id
            browser_use_model.value.model_id = model_id
            service.updateModel(browser_use_model.value).then((res) => {

            })

        }

    }

    )

})

onUnmounted(() => {
    emitter.off('default-assistant-setting-save')
    emitter.off('default-topic_naming-setting-save')
    emitter.off('default-translation-setting-save')

    emitter.off('default-model-changed')
})


</script>

<style scoped>
.default-model-container {
    display: flex;
    flex-direction: column;
}

.default-item {
    padding: 16px;
    margin-bottom: 10px;
    background-color: rgb(255, 255, 255);
    width: 70%;
    border: 1px solid #c6c6c6;
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    gap: 16px;
}

.item-header p {
    font-size: 18px;
}

.item-model {
    display: flex;
    align-items: center;
}

.item-tips {
    align-items: center;
}

.item-tips p {
    font-size: 12px;
    color: #5f5f5f;
}

.select_model {
    width: 95%;
    height: 100%;
    justify-content: start;
    align-items: center;
    display: flex;
}

.setting {
    color: #ffffff;
    height: 100%;
    display: flex;
    align-items: center;
}

.icon {
    color: #3c3c46c5;
}

@media screen and (max-width: 768px) {
    .default-model-container {
        margin: 0 !important;
    }

    .default-item {
        width: 100% !important;
        margin: 0 !important;
        margin-bottom: 16px !important;
        height: 100% !important;
    }


}
</style>
