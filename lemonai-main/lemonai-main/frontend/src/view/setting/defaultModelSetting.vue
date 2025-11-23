<template>
    <div class="default-model-service">
        <h2>{{ $t('setting.defaultModel.DefaultModelSetting') }}</h2>
        <defaultModel />
    </div>
</template>
<script setup>
import defaultModel from '@/components/defaultModel/index.vue'
</script>
<style scoped lang="scss">
.default-model-service {
    padding: 16px;
    height: 100%;
}

@media screen and (max-width: 768px) {
    h2 {
        display: none !important;
    }

    .default-model {
        padding: 0 !important;
    }

    .content-side {
        .default-model-service {
            padding: 0 !important;
        }
    }



}
</style>