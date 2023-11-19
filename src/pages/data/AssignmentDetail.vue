<template>
  <q-page class="flex" padding>
    <q-card class="card p-1 flex-1">
      <q-card-section>
        <div>
          <q-item-label class="text-xl font-bold">
            {{ assignment.title }}
          </q-item-label>
          <q-item-label caption class="text-[1rem] font-semibold">
            {{ assignment.score }}
          </q-item-label>
        </div>

        <div class="absolute top-2 right-2 flex">
          <q-card class="mr-2">
            <q-btn class="h-10" icon="undo" flat @click="$router.back()">
              <q-tooltip>{{ $t('return') }}</q-tooltip>
            </q-btn>
          </q-card>
          <q-card class="text-xs w-fit h-fit p-1 select-none">
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
        <q-card-section class="flex">
          <q-card class="w-fit h-fit">
            <q-btn noCaps flat @click="onUpdateStatus">
              <q-tooltip>
                {{ $t('changeStatusTo') }}{{ assignment.status ? $t('incomplete') : $t('complete') }}
              </q-tooltip>

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
          <q-card class="ml-4">
            <q-btn noCaps flat @click="onFetchDesc">{{ $t('fetchAssignmentDesc') }}</q-btn>
          </q-card>
        </q-card-section>

        <q-card-section>
          <div class="text-lg font-bold">{{ $t('directions') }}:</div>
          {{ assignment.desc || $t('none') }}
        </q-card-section>
      </div>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { Assignment } from 'src/components/AssignmentItem.vue';
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

const onUpdateStatus = () => {
  if (assignment.value.status) {
    assignment.value.status = undefined;
    api.put(`/data/assignment/${assignment.value.id}/0`).catch(() => null);
  } else {
    assignment.value.status = 1;
    api.put(`/data/assignment/${assignment.value.id}/1`).catch(() => null);
  }
};

const onFetchDesc = () => {
  $q.notify({ type: 'info', message: t('fetchingAssignmentDesc') });
  api
    .post(`data/fetch-desc/${assignment.value.id}`, {}, { timeout: 300000 })
    .then(() => {
      fetchAssignment(true);
      $q.notify({ type: 'positive', message: t('fetchSuccess') });
    })
    .catch(() => null);
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

onBeforeMount(() => fetchAssignment(true));
window.onfocus = () => fetchAssignment();
onBeforeUnmount(() => (window.onfocus = null));
</script>

<style scoped></style>
