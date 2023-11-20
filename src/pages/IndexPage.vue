<template>
  <q-page class="flex" padding>
    <q-card class="card p-1 w-[38rem]">
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
    <div class="w-[28rem] flex flex-col">
      <q-card class="card ml-4 mb-4 cursor-pointer" @click="showReportCard = !showReportCard" v-if="img !== ''">
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
      <q-card class="card ml-4 flex-1"></q-card>
    </div>
    <q-card class="card flex-1 p-4 ml-4"></q-card>
  </q-page>
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
});
</script>

<style scoped lang="scss"></style>
