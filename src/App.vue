<template>
  <router-view v-slot="{ Component }">
    <transition name="fade" mode="out-in">
      <component :is="Component" />
    </transition>
  </router-view>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAppStore } from './stores/app';
import { api } from './boot/axios';
import { Notify } from 'quasar';

const i18n = useI18n();
const store = useAppStore();

onMounted(() => {
  // Ask notification permission
  if (window.Notification.permission !== 'granted') {
    Notify.create({ type: 'warning', message: i18n.t('notifyPermissionRequired') });
    window.Notification.requestPermission();
  }

  // Locale
  i18n.locale.value = localStorage.getItem('locale')!;

  // Get previous data from local storage
  store.gpa = localStorage.getItem('gpa') || '';
  store.fetchedAt = localStorage.getItem('fetchedAt') || '';
  store.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  store.courses = JSON.parse(localStorage.getItem('courses') || '[]');

  // Store data to local storage on page close
  onbeforeunload = () => {
    window.removeEventListener('focus', () => fetchNotification);
    localStorage.setItem('gpa', store.gpa);
    localStorage.setItem('fetchedAt', store.fetchedAt);
    localStorage.setItem('notifications', JSON.stringify(store.notifications));
    localStorage.setItem('courses', JSON.stringify(store.courses));
  };

  // Add focus event listener for notification fetching
  fetchNotification(undefined, true);
  window.addEventListener('focus', () => fetchNotification());

  // Start bg worker for fetching messages every 30 minutes
  startFetchOnInterval();
});

const startFetchOnInterval = async () => {
  while (true) {
    const timeToWait = 2100000 - (Date.now() - new Date(Number(store.fetchedAt)).getTime());
    if (timeToWait > 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
    }
    fetchNotification();
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};

const fetchNotification = (retry?: number, instant?: boolean) => {
  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  if (retry != undefined) {
    if (retry > 3) {
      return;
    }
    retry++;
  }

  api
    .get('/data/message')
    .then((res) => store.updateNotifications(res.data.data.data))
    .catch(() => fetchNotification(retry || 1));
};
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0.25;
}
</style>
