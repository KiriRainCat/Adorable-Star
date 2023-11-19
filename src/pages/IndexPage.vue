<template>
  <q-page class="flex" padding>
    <q-card class="card mr-4 p-1 w-[32rem]">
      <div class="text-center text-xl font-bold py-2">{{ $t('notification') }}</div>
      <q-scroll-area class="h-[92%] w-full">
        <q-infinite-scroll>
          <div v-if="notifications.length < 1" class="text-center">{{ $t('noNotification') }}</div>
          <NotificationItemVue
            v-for="(notification, idx) in notifications"
            :="notification"
            :key="idx"
            @delete="notifications?.splice(idx, 1)"
          />
        </q-infinite-scroll>
      </q-scroll-area>
    </q-card>
    <q-card class="card flex-1 p-4">Homework Completion / Analytics</q-card>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import NotificationItemVue from 'src/components/NotificationItem.vue';
import { useAppStore } from 'src/stores/app';
import { onBeforeMount } from 'vue';

const store = useAppStore();
const { notifications } = storeToRefs(store);

onBeforeMount(() => {
  api
    .get('/data/message', { headers: { Instant: 'true' } })
    .then((res) => store.updateNotifications(res.data.data.data))
    .catch(() => null);
});
</script>

<style scoped lang="scss"></style>
