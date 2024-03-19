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
        <q-card class="card mr-4 flex-1">
          <q-item-section @click="$router.push('/calendar')" class="text-center text-xl mt-4 font-bold cursor-pointer">
            {{ $t('todoList') }}
            <q-tooltip anchor="top middle" :offset="[14, 32]">{{ $t('clickToLearnMore') }}</q-tooltip>
          </q-item-section>

          <div>{{ selectableDates[selectedDateIdx] }}</div>

          <div class="px-4 h-[80%]">
            <q-card class="card mb-5 h-[46%] flex justify-center">
              <div class="font-semibold -my-4 flex items-center">
                <div class="w-3 h-3 bg-pink-300 rounded-full mr-1"></div>
                {{ $t('incomplete') }}
              </div>
              <q-scroll-area class="w-full h-4/5 px-2 pb-2" :thumbStyle="{ width: '4px', right: '4px' }">
                <draggable
                  @change="(event) => onChangeStatus(event, 0)"
                  group="assignments"
                  :list="filteredAssignments[0]"
                  itemKey="id"
                  :class="'flex' + (filteredAssignments[0].length == 0 ? ' min-h-[10rem]' : '')"
                >
                  <!-- eslint-disable-next-line vue/no-unused-vars -->
                  <template #item="{ element }">
                    <assignment-card :="element" />
                  </template>
                </draggable>
              </q-scroll-area>
            </q-card>
            <q-card class="card h-[46%] flex justify-center">
              <div class="font-semibold -my-4 flex items-center">
                <div class="w-3 h-3 bg-cyan-300 rounded-full mr-1"></div>
                {{ $t('completed') }}
              </div>
              <q-scroll-area class="w-full h-4/5 px-2 pb-2" :thumbStyle="{ width: '4px', right: '4px' }">
                <draggable
                  @change="(event) => onChangeStatus(event, 1)"
                  group="assignments"
                  :list="filteredAssignments[1]"
                  itemKey="id"
                  :class="'flex' + (filteredAssignments[1].length == 0 ? ' min-h-[10rem]' : '')"
                >
                  <!-- eslint-disable-next-line vue/no-unused-vars -->
                  <template #item="{ element }">
                    <assignment-card :="element" />
                  </template>
                </draggable>
              </q-scroll-area>
            </q-card>
          </div>
        </q-card>
      </div>
      <q-card class="card flex-1 mt-4 mr-4 sm:min-w-[21rem] min-h-[47.7rem]"></q-card>
    </q-page>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { date, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { api } from 'src/boot/axios';
import NotificationItemVue from 'src/components/NotificationItem.vue';
import { useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import Draggable from 'vuedraggable';
import { Assignment } from 'src/components/AssignmentItem.vue';

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
    cancel: { label: t('cancel'), color: 'grey', noCaps: true },
    ok: { label: t('confirm'), color: 'red', noCaps: true },
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

  fetchAssignments(true);
  setTimeout(() => setToNow(), 5000);
});

/* ---------------------------------- 可抽离代码 --------------------------------- */

const key = ref(1);
const selectedDateIdx = ref(0);
const selectableDates = ref(['']);
const setToNow = () => {
  selectedDateIdx.value = selectableDates.value.indexOf(date.formatDate(Date.now(), 'YYYY/MM/DD'));
  if (selectedDateIdx.value == -1) {
    for (let i = 0; i < selectableDates.value.length; i++) {
      if (Number.parseInt(new Date(selectableDates.value[i]).toUTCString()) > Date.now()) {
        selectedDateIdx.value = i;
        break;
      }
    }
  }
  filterAssignments();
};

const course = ref('');
const courses = ref(['']);
const assignments = ref<Assignment[]>([]);
const filteredAssignments = ref<Assignment[][]>([[], []]);
const filterAssignments = () => {
  filteredAssignments.value[0] = assignments.value.filter(
    (val) =>
      val.due.includes(selectableDates.value[selectedDateIdx.value].replaceAll('/', '-')) &&
      val.status == undefined &&
      val.from != course.value
  );
  filteredAssignments.value[1] = assignments.value.filter(
    (val) =>
      val.due.includes(selectableDates.value[selectedDateIdx.value].replaceAll('/', '-')) && val.status == 1 && val.from != course.value
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onChangeStatus = (event: any, status: number) => {
  if (event.added) {
    api
      .put(`/data/assignment/${event.added.element.id}/${status}`)
      .then(() => {
        const l1 = filteredAssignments.value[0].length;
        const l2 = filteredAssignments.value[0].length;
        if (l1 == 0 || l1 == l2 || l1 + 1 == l2) {
          fetchAssignments(true);
          key.value++;
        }
      })
      .catch(() => null);
  }
};

const fetchAssignments = (instant?: boolean) => {
  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  api
    .get('/data/assignment')
    .then((res) => {
      assignments.value = res.data.data.data;

      selectableDates.value.push(date.formatDate(Date.now(), 'YYYY/MM/DD'));
      assignments.value.forEach((assignment) => {
        let due = assignment.due.substring(0, 10);
        if (due !== '0001-01-01') {
          due = due.replaceAll('-', '/');
        }

        if (!selectableDates.value.includes(due)) {
          selectableDates.value.push(due);
        }

        if (!courses.value.includes(assignment.from)) {
          courses.value.push(assignment.from);
        }
      });

      filterAssignments();
    })
    .catch(() => null);
};
</script>
