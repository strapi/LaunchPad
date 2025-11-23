<template>
  <div class="content-side">
    <component :is="activeComponent" />
  </div>
</template>

<script setup>
import { defineAsyncComponent } from 'vue'

const props = defineProps({
  activeMenu: {
    type: String,
    required: true
  }
})

const activeComponent = defineAsyncComponent(() =>
  import(`./${props.activeMenu}.vue`)
)
</script>

<style scoped>
.content-side {
  flex: 1;
  background: white;
  border-radius: 8px;
  margin-left: 16px;
}
</style>