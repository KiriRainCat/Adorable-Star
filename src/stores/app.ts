import { defineStore } from 'pinia';
import { Notification } from 'src/components/NotificationItem.vue';

export const useAppStore = defineStore('app', {
  state: () => ({
    fetchedAt: '',
    gpa: '',
    notifications: new Array<Notification>(),
  }),
  actions: {
    updateNotifications(notifications: Notification[]) {
      this.notifications = notifications;
    },
  },
});
