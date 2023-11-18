import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { Notification } from 'src/components/NotificationItem.vue';

export const useAppStore = defineStore('app', {
  state: () => ({
    fetchedAt: '',
    gpa: '',
    notifications: new Array<Notification>(),
  }),
  actions: {
    updateNotifications(notifications: Notification[]) {
      // Filter out new notifications from backend
      const newNotifications = notifications.filter((val) => !this.notifications.includes(val));

      // Notify user via system notification
      newNotifications.forEach((notification) => {
        if (window.Notification.permission !== 'granted') {
          Notify.create({ type: 'warning', message: i18n.global.t('notifyPermissionRequired') });
          window.Notification.requestPermission();
        }

        const sysNotification = new window.Notification('萌媛星', {
          body: `${notification.course} ${notification.assignment} ${notification.msg}`,
        });
        sysNotification.onclick;
      });

      this.notifications = notifications;
    },
  },
});
