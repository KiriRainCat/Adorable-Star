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

const i18n = useI18n();
const store = useAppStore();

onMounted(() => {
  // Locale
  i18n.locale.value = localStorage.getItem('locale')!;

  // Get previous data from local storage
  store.gpa = localStorage.getItem('gpa') || '';
  store.fetchedAt = localStorage.getItem('fetchedAt') || '';
  store.notifications = JSON.parse(localStorage.getItem('notifications') || '[]');

  // Store data to local storage on page close
  onbeforeunload = () => {
    localStorage.setItem('gpa', store.gpa);
    localStorage.setItem('fetchedAt', store.fetchedAt);
    localStorage.setItem('notifications', JSON.stringify(store.notifications));
  };

  // Start long polling for notifications
  setTimeout(
    () => {
      fetchNotification();
      setInterval(() => fetchNotification(), 1800000);
    },
    1800000 - Date.now() + new Date(Number(store.fetchedAt)).getTime(), // 根据上次数据检索的时间计算下次大概在什么时候
  );
});

const fetchNotification = (retry?: number) => {
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
