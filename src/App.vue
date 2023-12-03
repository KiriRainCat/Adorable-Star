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
import { onBeforeUnmount } from 'vue';

const i18n = useI18n();
const store = useAppStore();

onMounted(() => {
  if (window.Notification.permission !== 'granted') {
    window.alert(i18n.t('notifyPermissionRequired'));
  }
  // Locale
  i18n.locale.value = localStorage.getItem('locale') || navigator.language;

  // Get previous data from local storage
  store.gpa = localStorage.getItem('gpa') || '';
  store.fetchedAt = localStorage.getItem('fetchedAt') || '';
  store.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');
  store.courses = JSON.parse(localStorage.getItem('courses') || '[]');

  // Store data to local storage on page close
  onBeforeUnmount(() => {
    localStorage.setItem('gpa', store.gpa);
    localStorage.setItem('fetchedAt', store.fetchedAt);
    localStorage.setItem('notifications', JSON.stringify(store.notifications));
    localStorage.setItem('courses', JSON.stringify(store.courses));
  });

  // Add event listeners for notification fetching and state changing
  fetchNotification(undefined, true);
  window.addEventListener('blur', () => {
    store.focused = false;

    // Store data to local storage on page blur
    localStorage.setItem('gpa', store.gpa);
    localStorage.setItem('fetchedAt', store.fetchedAt);
    localStorage.setItem('notifications', JSON.stringify(store.notifications));
    localStorage.setItem('courses', JSON.stringify(store.courses));
  });
  window.addEventListener('focus', () => {
    store.focused = true;
    fetchNotification();
  });

  // Start bg worker for fetching messages every 30 minutes
  startFetchOnInterval();
});

const startFetchOnInterval = async () => {
  while (true) {
    const timeToWait = 2100000 - (Date.now() - new Date(Number(store.fetchedAt)).getTime());
    if (timeToWait >= 0) {
      await new Promise((resolve) => setTimeout(resolve, timeToWait));
      fetchNotification();
    }
    await new Promise((resolve) => setTimeout(resolve, 60000));
  }
};

const fetchNotification = (retry?: number, instant?: boolean) => {
  if (localStorage.getItem('token')?.length == 0) {
    return;
  }

  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  if (retry != undefined) {
    if (retry > 3) {
      return;
    }
    setTimeout(() => {
      api
        .get('/data/message')
        .then((res) => store.updateNotifications(res.data.data.data))
        .catch(() => fetchNotification(retry || 1));
    }, 180000);
    retry++;
    return;
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
