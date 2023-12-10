<template>
  <q-scroll-area class="w-[100vw] h-[93.3vh]" :bar-style="{ opacity: '0' }" :thumb-style="{ opacity: '0' }">
    <q-page class="flex pl-4 pb-4 max-sm:pb-32">
      <q-card class="card flex-1 mt-4 mr-4 p-1 min-w-[32rem] max-sm:min-w-[16rem] min-h-[47.7rem]">
        <div class="text-center text-xl font-bold py-4">{{ $t('notification') + $t('message') }}</div>
        <q-btn class="absolute top-2.5 right-3" flat round color="red" icon="delete_sweep" @click="onEmptyingMsg">
          <q-tooltip>{{ $t('deleteAll') + $t('notification') + $t('message') }}</q-tooltip>
        </q-btn>
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
      <div class="sm:min-w-[28rem] max-sm:min-w-full mt-4 flex flex-col min-h-[47.7rem]">
        <q-card class="card mr-4 mb-4 cursor-pointer" @click="showReportCard = !showReportCard" v-if="img !== ''">
          <q-item-section class="absolute top-4 left-4" v-if="!showReportCard">
            <q-item-label class="text-lg font-bold">{{ $t('reportCard') }}</q-item-label>
            <q-item-label caption>
              {{ `${$t('clickTo')} ${$t('show')} / ${$t('hide')} ${$t('reportCard')}` }}
            </q-item-label>
          </q-item-section>
          <img
            :src="img"
            :class="(showReportCard ? 'opacity-100' : 'opacity-0') + ' max-h-full transition-all duration-1000 h-auto'"
            alt="Report Card"
          />
        </q-card>
        <q-skeleton class="card mr-4 mb-4 h-44" v-else />
        <q-card class="card mr-4 flex-1"></q-card>
      </div>
      <q-card class="card flex-1 mt-4 mr-4 sm:min-w-[21rem] min-h-[47.7rem]"></q-card>
    </q-page>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import NotificationItemVue from 'src/components/NotificationItem.vue';
import { useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

const { t } = useI18n();
const $q = useQuasar();
const store = useAppStore();
const { notifications } = storeToRefs(store);

const img = ref('');
const showReportCard = ref(false);

const onEmptyingMsg = () => {
  $q.dialog({
    title: `<span class="text-lg">${t('deleteAll')}${t('notification')}${t('message')}?<span>`,
    focus: 'none',
    html: true,
    ok: { label: t('confirm'), color: 'red' },
  }).onOk(() => {
    store.updateNotifications([]);
    api.delete('/data/message').catch(() => null);
  });
};

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
