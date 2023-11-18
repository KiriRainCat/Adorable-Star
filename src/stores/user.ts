import { defineStore } from 'pinia';

export const useUserStore = defineStore('account', {
  state: () => ({
    uid: 0,
    name: '',
    password: '',
    fetchedAt: '',
    gpa: '',
  }),
  actions: {
    clearAccount() {
      this.uid = 0;
      this.name = '';
      this.password = '';
    },
  },
});
