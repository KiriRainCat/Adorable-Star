<template>
  <q-page class="flex" padding>
    <q-card class="card p-1 flex-1">
      <q-card-section>
        <div>
          <q-item-label class="sm:text-xl font-bold">
            {{ assignment.title }}
          </q-item-label>
          <q-item-label caption class="sm:text-[1rem] font-semibold">
            {{ assignment.score }}
          </q-item-label>
        </div>

        <div class="absolute top-2 right-2 flex max-sm:flex-col-reverse">
          <q-card class="sm:mr-2 max-sm:mt-2 text-center">
            <q-btn class="h-full text-xs z-10" icon="undo" flat @click="$router.back()">
              <q-tooltip>{{ $t('return') }}</q-tooltip>
            </q-btn>
          </q-card>
          <q-card class="text-xs w-fit h-fit p-1 select-none max-sm:text-[0.6rem]">
            <div class="flex">
              <div class="w-2 h-2 bg-pink-300 rounded-full mr-1 mt-1" />
              = {{ $t('incomplete') }}
            </div>
            <div class="flex">
              <div class="w-2 h-2 bg-cyan-300 rounded-full mr-1 mt-1" />
              = {{ $t('complete') }}
            </div>
          </q-card>
        </div>
      </q-card-section>

      <div v-if="assignment.title != undefined">
        <q-card-section>
          <q-item-label caption class="sm:text-[0.9rem] font-semibold">{{ $t('due') }}: {{ formatTime(assignment.due) }}</q-item-label>
        </q-card-section>

        <q-card-section class="flex">
          <q-card class="w-fit h-fit">
            <q-btn noCaps flat @click="onUpdateStatus" class="max-sm:p-2 max-sm:text-[0.6rem]">
              <q-tooltip>{{ $t('changeStatusTo') }}{{ assignment.status ? $t('incomplete') : $t('complete') }}</q-tooltip>

              <div v-if="assignment.status == undefined" class="flex items-center">
                <div class="w-3 h-3 bg-pink-300 rounded-full mr-2" />
                {{ $t('incomplete') }}
              </div>
              <div v-if="assignment.status == 1" class="flex items-center">
                <div class="w-3 h-3 bg-cyan-300 rounded-full mr-2" />
                {{ $t('complete') }}
              </div>
            </q-btn>
          </q-card>

          <q-card class="ml-4 max-sm:ml-2" v-if="assignment.turn_in_able">
            <q-tooltip>{{ $t('turnIn') }}</q-tooltip>
            <q-btn-dropdown
              dropdown-icon="file_upload"
              no-icon-animation
              flat
              auto-close
              :menu-offset="[40, 80]"
              menu-anchor="top end"
              color="teal"
              @click="null"
              class="max-sm:p-2 max-sm:text-[0.6rem]"
            >
              <div class="flex flex-col">
                <q-btn flat noCaps v-for="(turnInType, idx) in assignment.turn_in_types" :key="idx" @click="() => onTurnIn(turnInType)">
                  {{ turnInType }}
                </q-btn>
              </div>
            </q-btn-dropdown>
          </q-card>

          <q-card class="ml-4 max-sm:ml-2">
            <q-btn flat icon="refresh" @click="() => onFetchDetail()" class="max-sm:p-2 max-sm:text-[0.6rem]">
              <q-tooltip>
                {{ $t('fetchAssignmentDetail') }}
              </q-tooltip>
            </q-btn>
          </q-card>

          <q-card class="ml-4 max-sm:ml-2" v-if="status >= 200">
            <q-btn flat icon="sync_problem" @click="() => onFetchDetail(true)" class="max-sm:p-2 max-sm:text-[0.6rem]">
              <q-tooltip>
                {{ $t('force') + $t('fetchAssignmentDetail') }}
              </q-tooltip>
            </q-btn>
          </q-card>
        </q-card-section>

        <q-card-section>
          <div class="sm:text-lg font-bold whitespace-pre-wrap">{{ $t('directions') }}:</div>
          <div class="max-sm:text-xs" v-html="assignment.desc || $t('none')" />
        </q-card-section>

        <q-card-section>
          <div class="sm:text-lg font-bold whitespace-pre-wrap">{{ $t('uploaded') }}:</div>
          <q-card v-for="(item, idx) in assignment.turn_in_list" :key="idx" class="max-w-md mt-2">
            <q-tooltip>{{ $t('unSubmit') }}</q-tooltip>
            <q-btn noCaps flat class="max-sm:p-2 max-sm:text-[0.6rem] w-full" align="left">
              {{ item }}
            </q-btn>
          </q-card>
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Assignment } from 'src/components/AssignmentItem.vue';
import FileUploader from 'src/components/dialog/FileUploader.vue';
import TextEditor from 'src/components/dialog/TextEditor.vue';
import { useAppStore } from 'src/stores/app';
import { onBeforeMount } from 'vue';
import { onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const $q = useQuasar();
const $route = useRoute();
const store = useAppStore();
const { t } = useI18n();

const status = Number.parseInt(localStorage.getItem('status')!);

const formatTime = (raw: string) => {
  if (raw.substring(0, 4) === '0001') {
    return 'Future';
  }
  return `${raw.substring(5, 7)}/${raw.substring(8, 10)}`;
};

const onUpdateStatus = () => {
  if (assignment.value.status) {
    assignment.value.status = undefined;
    api.put(`/data/assignment/${assignment.value.id}/0`).catch(() => null);
  } else {
    assignment.value.status = 1;
    api.put(`/data/assignment/${assignment.value.id}/1`).catch(() => null);
  }
};

const onFetchDetail = (force?: boolean) => {
  $q.notify({ type: 'info', message: t('fetchingInProgress') });
  if (force) {
    $q.loading.show();
    api
      .post(`data/fetch-desc/${assignment.value.id}?force=true`)
      .then(() => updateAssignment())
      .catch(() => setTimeout(() => updateAssignment(), 180000))
      .finally(() => $q.loading.hide());
  } else {
    api
      .post(`data/fetch-desc/${assignment.value.id}`)
      .then(() => updateAssignment())
      .catch(() => setTimeout(() => updateAssignment(), 180000));
  }
};

const assignment = ref(<Assignment>{});

const fetchAssignment = (instant?: boolean) => {
  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  api
    .get(`/data/assignment/${$route.params['id']}`)
    .then((res) => (assignment.value = res.data.data.data))
    .catch(() => null);
};

const updateAssignment = () => {
  if ($route.params['id'] != undefined) {
    fetchAssignment(true);
  }

  api
    .get('/data/message')
    .then((res) => store.updateNotifications(res.data.data.data))
    .catch(() => null);

  $q.notify({ type: 'positive', message: t('fetchSuccess') });
};

const onTurnIn = (turnInType: string) => {
  if (turnInType === 'Files') {
    $q.dialog({ component: FileUploader, componentProps: { id: assignment.value.id, refreshFn: () => fetchAssignment(true) } });
  } else {
    $q.dialog({ component: TextEditor, componentProps: { id: assignment.value.id, refreshFn: () => fetchAssignment(true) } });
  }
};

onBeforeMount(() => fetchAssignment(true));
window.onfocus = () => fetchAssignment();
onBeforeUnmount(() => (window.onfocus = null));
</script>

<style scoped></style>
