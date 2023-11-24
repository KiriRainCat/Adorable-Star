<template>
  <q-scroll-area class="w-[100vw] h-[93.3vh]" :bar-style="{ opacity: '0' }" :thumb-style="{ opacity: '0' }">
    <q-page class="flex pl-4 pb-4">
      <q-card class="card flex-1 mt-4 mr-4 p-1 sm:min-w-[32rem] min-h-[47.7rem] max-h-[47.7rem]">
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
      <div class="w-[28rem] mt-4 flex flex-col min-h-[47.7rem] max-h-[47.7rem]">
        <q-card class="card mr-4 mb-4 cursor-pointer" @click="showReportCard = !showReportCard" v-if="img !== ''">
          <q-tooltip>{{ (showReportCard ? $t('hide') : $t('show')) + $t('reportCard') }}</q-tooltip>
          <q-item-section class="absolute top-4 left-4" v-if="!showReportCard">
            <q-item-label class="text-lg font-bold">{{ $t('reportCard') }}</q-item-label>
            <q-item-label caption>{{ $t('clickTo') + $t('show') + $t('reportCard') }}</q-item-label>
          </q-item-section>
          <img
            :src="img"
            :class="(showReportCard ? 'opacity-100' : 'opacity-0') + ' transition-all duration-1000'"
            alt="Report Card"
          />
        </q-card>
        <q-card class="card mr-4 flex-1"></q-card>
      </div>
      <q-card class="card flex-1 mt-4 mr-4 sm:min-w-[24rem] min-h-[47.7rem] max-h-[47.7rem]"></q-card>
    </q-page>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import NotificationItemVue from 'src/components/NotificationItem.vue';
import { useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

const store = useAppStore();
const { notifications } = storeToRefs(store);

const img = ref('');
const showReportCard = ref(false);

onBeforeMount(() => {
  api
    .get('/data/report', { responseType: 'blob' })
    .then((res) => (img.value = window.URL.createObjectURL(res.data)))
    .catch(() => null);

  api
    .get('/data/message')
    .then((res) => store.updateNotifications(res.data.data.data))
    .catch(() => null);
});
</script>

<style scoped lang="scss"></style>
