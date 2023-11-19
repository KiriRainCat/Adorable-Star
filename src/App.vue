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
});
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
