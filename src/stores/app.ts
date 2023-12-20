import { defineStore } from 'pinia';
import { Notify } from 'quasar';
import { i18n } from 'src/boot/i18n';
import { Course } from 'src/components/CourseItem.vue';
import { Notification } from 'src/components/NotificationItem.vue';

const t = i18n.global.t;

export const useAppStore = defineStore('app', {
  state: () => ({
    focused: true,
    fetchedAt: '',
    gpa: '',
    notifications: new Array<Notification>(),
    courses: new Array<Course>(),
  }),
  getters: {
    getDateString(): string {
      const date = new Date(Number(this.fetchedAt)).toLocaleString();
      if (date.startsWith('0001-') || this.fetchedAt.length == 0) {
        return 'None';
      }

      return `${date.substring(5, date.length - 3)}`;
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

      // Update the notifications
      this.notifications = notifications;

      // Flash the title when the page is not focused
      let interval: NodeJS.Timeout;
      if (!this.focused && newNotifications.length > 0) {
        interval = setInterval(() => {
          if (document.title.includes('【')) {
            document.title = '萌媛星';
          } else {
            document.title = `【 ${t('new')}${t('notification')} 】`;
          }
        }, 500);

        // Stop flashing when tab focused
        window.addEventListener('focus', () => {
          clearInterval(interval);
          document.title = '萌媛星';
        });
      }

      // Notify user via system notification
      newNotifications.forEach((notification) => {
        if (window.Notification.permission === 'granted') {
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
                    body: `${notification.assignment} [${notification.msg.split('|')[1]} → ${notification.msg.split('|')[2]}]`,
                  });
                  break;
                case 'Score':
                  new window.Notification(`萌媛星 - ${t('assignment')}${t('score')}${t('changed')}`, {
                    body: `${notification.assignment} [ ${notification.msg.split('|')[1]} → ${notification.msg.split('|')[2]} ]`,
                  });
                  break;
                case 'Feedback':
                  new window.Notification(`萌媛星 - ${t('assignment')}${t('feedback')}${t('changed')}`, {
                    body: `${notification.assignment} [ ${notification.msg.split('|')[1]} → ${notification.msg.split('|')[2]} ]`,
                  });
                  break;
              }
              break;
            case 2:
              new window.Notification(`萌媛星 - ${t('course')}${t('grade')}${t('changed')}`, {
                body: `${notification.course} [${notification.msg.split('|')[1]} → ${notification.msg.split('|')[2]}]`,
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
            onDismiss: () => {
              // Stop the flashing title if any
              clearInterval(interval);
              document.title = '萌媛星';
            },
          });
        } else {
          window.Notification.requestPermission(() => null);
        }
      });
    },
  },
});
