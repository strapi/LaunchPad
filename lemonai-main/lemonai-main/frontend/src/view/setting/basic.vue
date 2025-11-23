<template>
  <div class="basic-settings">
    <h2>{{ $t(`setting.basic.title`) }}</h2>

    <langService/>
  </div>
</template>

<script setup>
import langService from '@/components/lang/index.vue'
// 可添加响应式逻辑
</script>

<style scoped>
.basic-settings {
  padding: 16px;
}
.setting-item {
  margin: 12px 0;
  padding: 12px;
  background: #fff;
  border-radius: 4px;
  box-shadow: 0 1px 2px rgba(0,0,0,0.1);
}

@media screen and (max-width: 768px) {
  h2{
    display: none!important;
  }
  .basic-settings{
    padding: 0!important;
  }
}
</style>