import { defineStore } from 'pinia';

export const useAccountStore = defineStore('account', {
  state: () => ({
    uid: 0,
    name: '',
    password: '',
  }),
  actions: {
    clear() {
      this.uid = 0;
      this.name = '';
      this.password = '';
    },
  },
});
