<template>
    <div class="search-service">
        <h2>{{$t('setting.searchService.title')}}</h2>
        <searchEngine/>
    </div>
</template>

<script setup>
import searchEngine from '@/components/searchEngine/index.vue'
</script>

<style scoped>

.search-service {
padding: 16px;
}

@media screen and (max-width: 768px) {
    .search-service {
        padding: 0px!important;
    }
    h2{
        display: none!important;
    }
}
</style>