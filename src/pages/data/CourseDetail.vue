<template>
  <q-page class="flex" padding>
    <q-card class="card p-1 flex-1">
      <q-card-section>
        <div>
          <q-item-label class="text-xl font-bold">
            {{ course.title }}
          </q-item-label>
          <q-item-label caption class="text-[1rem] font-semibold">
            {{ course.percent_grade }} {{ course.letter_grade }}
          </q-item-label>
        </div>

        <q-card class="absolute top-2 right-20">
          <q-btn class="h-10" icon="undo" flat to="/data">
            <q-tooltip>{{ $t('return') }}</q-tooltip>
          </q-btn>
        </q-card>

        <q-card class="text-xs absolute top-2 right-2 w-fit h-fit p-1 select-none">
          <div class="flex">
            <div class="w-2 h-2 bg-pink-300 rounded-full mr-1 mt-1" />
            = {{ $t('incomplete') }}
          </div>
          <div class="flex">
            <div class="w-2 h-2 bg-cyan-300 rounded-full mr-1 mt-1" />
            = {{ $t('complete') }}
          </div>
        </q-card>
      </q-card-section>

      <q-card-section class="w-full h-[88%]">
        <q-item-label class="ml-6 font-bold">{{ $t('assignmentList') }}:</q-item-label>
        <q-scroll-area class="w-full h-full px-6 py-2">
          <AssignmentItemVue
            v-for="(assignment, idx) in course.assignments"
            :key="idx"
            :assignment="assignment"
            @update="onUpdateStatus(idx)"
          />
        </q-scroll-area>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import AssignmentItemVue, { Assignment } from 'src/components/AssignmentItem.vue';
import { useAppStore } from 'src/stores/app';
import { onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';
import { useRoute } from 'vue-router';

const $route = useRoute();
const store = useAppStore();

const onUpdateStatus = (idx: number) => {
  if (course.value.assignments[idx].status) {
    course.value.assignments[idx].status = undefined;
    api.put(`/data/assignment/${course.value.assignments[idx].id}/0`).catch(() => null);
  } else {
    course.value.assignments[idx].status = 1;
    api.put(`/data/assignment/${course.value.assignments[idx].id}/1`).catch(() => null);
  }
};

interface Course {
  title: string;
  letter_grade?: string;
  percent_grade?: string;
  assignments: Assignment[];
}
const course = ref(<Course>{});

const fetchCourse = (instant?: boolean) => {
  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  api
    .get(`/data/course/${$route.params['id']}`)
    .then((res) => (course.value = res.data.data.data))
    .catch(() => null);
};

onBeforeMount(() => fetchCourse(true));
window.onfocus = () => fetchCourse();
onBeforeUnmount(() => (window.onfocus = null));
</script>

<style scoped></style>
