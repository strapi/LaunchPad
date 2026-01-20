import { defineStore } from 'pinia'

export const useDemoStore = defineStore('demo', {
  state: () => ({
    count: 0,
  }),
  actions: {
    setCount(count) {
      this.count = count;
    }
  },
  persist: true,
})
