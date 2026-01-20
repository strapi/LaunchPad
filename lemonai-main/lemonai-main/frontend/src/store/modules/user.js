import { set } from '@vueuse/core';
import { defineStore } from 'pinia'

export const useUserStore = defineStore('user', {
  state: () => ({
    user: {},
    membership:{},
    points:{}
  }),
  actions: {
    setUser(user) {
      console.log('setUser', user);
      this.user = user;
    },
    setMembership(membership) {
      console.log('setMembership', membership);
      this.membership = membership;
    },
    setPoints(points) {
      this.points = points;
    },
    clear(){
      this.user = {};
      this.membership = {};
      this.points = {};
    }

  },
  persist: true,
})
