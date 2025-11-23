<template>
  <h1>{{ msg }}</h1>

  <div class="card">
    <button type="button" @click="plus()">count is {{ demoStore.count }}</button>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank">create-vue</a>, the official Vue + Vite
    starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support" target="_blank">Vue Docs Scaling up Guide</a>.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<script setup>
import { ref } from 'vue'
import { useDemoStore } from "@/store/modules/demo.js";
const demoStore = useDemoStore();

defineProps({
  msg: String,
})

// const count = ref(0)
const plus = () => {
  demoStore.setCount(demoStore.count + 1);
}

</script>



<style scoped>
.read-the-docs {
  color: #888;
}
</style>
