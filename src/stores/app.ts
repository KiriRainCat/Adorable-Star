import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { Course } from 'src/components/CourseItem.vue';
import { Notification } from 'src/components/NotificationItem.vue';

const t = i18n.global.t;

export const useAppStore = defineStore('app', {
  state: () => ({
    fetchedAt: '',
    gpa: '',
    notifications: new Array<Notification>(),
    courses: new Array<Course>(),
  }),
  getters: {
    getDateString(): string {
      const str = new Date(Number(this.fetchedAt)).toLocaleString();
      return `${str.substring(5, 11)} ${str.substring(11, 16)}`;
    },
  },
  actions: {
    updateNotifications(notifications: Notification[]) {
      // Filter out new notifications from backend
      const newNotifications = notifications.filter((val) => {
        for (let i = 0; i < this.notifications.length; i++) {
          if (this.notifications[i].id == val.id) {
            return false;
          }
        }
        return true;
      });

      // Notify user via system notification
      newNotifications.forEach((notification) => {
        if (window.Notification.permission !== 'granted') {
          Notify.create({ type: 'warning', message: t('notifyPermissionRequired') });
          window.Notification.requestPermission();
        }

        // Notification types
        switch (notification.type) {
          case -1:
            new window.Notification(`萌媛星 - ${t('system')}${t('notification')}`, {
              body: t(notification.msg),
            });
            break;
          case undefined:
            new window.Notification(`萌媛星 - ${t('new')}${t('assignment')}`, {
              body: `${notification.assignment}\n${t('course')}: ${notification.course}`,
            });
            break;
          case 1:
            switch (notification.msg.split('|')[0]) {
              case 'Desc':
                new window.Notification(`萌媛星 - ${t('assignment')}${t('directions')}${t('changed')}`, {
                  body: `${notification.assignment}\n${t('course')}: ${notification.course}`,
                });
                break;
              case 'Due':
                new window.Notification(`萌媛星 - ${t('assignment')}${t('due')}${t('changed')}`, {
                  body: `${notification.course} [${notification.msg.split('|')[0]} → ${
                    notification.msg.split('|')[1]
                  }]`,
                });
                break;
              case 'Score':
                new window.Notification(`萌媛星 - ${t('assignment')}${t('score')}${t('changed')}`, {
                  body: `${notification.course} [${notification.msg.split('|')[0]} → ${
                    notification.msg.split('|')[1]
                  }]`,
                });
                break;
            }
            break;
          case 2:
            new window.Notification(`萌媛星 - ${t('course')}${t('grade')}${t('changed')}`, {
              body: `${notification.course} [${notification.msg.split('|')[0]} → ${notification.msg.split('|')[1]}]`,
            });
            break;
        }

        // Show non-auto-closable notification that display count of unread notifications
        Notify.create({
          type: 'warning',
          multiLine: false,
          actions: [
            { icon: 'info', round: true, to: '/index' },
            { icon: 'close', color: 'black', round: true },
          ],
          timeout: 99999999999,
          message: t('haveUnreadNotification'),
        });
      });

      this.notifications = notifications;
    },
  },
});
