<template>
  <q-page class="flex" padding>
    <q-card class="card mr-4 p-1 w-[38rem]">
      <div class="text-center text-xl font-bold py-2">{{ $t('notification') + $t('message') }}</div>
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
import NotificationItemVue from 'src/components/NotificationItem.vue';
import { useAppStore } from 'src/stores/app';

const store = useAppStore();
const { notifications } = storeToRefs(store);
</script>

<style scoped lang="scss"></style>
