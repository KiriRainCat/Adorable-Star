<template>
  <q-scroll-area class="w-[100vw] h-[93.3vh]" :bar-style="{ opacity: '0' }" :thumb-style="{ opacity: '0' }">
    <q-page class="flex pl-4 sm:pb-4 max-sm:pb-32">
      <q-card class="card flex-1 mt-4 mr-4 p-1 sm:min-w-[32rem] min-h-[47.7rem]">
        <div class="text-center text-xl font-bold py-3">{{ $t('assignment') }}</div>
        <div class="px-4 h-[82vh]">
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
      <div class="lg:w-[28rem] w-full mt-4 flex lg:flex-col lg:min-h-[47.7rem] min-h-[30rem]">
        <q-card class="card mr-4 mb-4 flex-1">
          <q-date
            minimal
            :key="key"
            :events="(date) => selectableDates.includes(date)"
            :eventColor="generateEventColor"
            v-model="selectedDate"
            :options="selectableDates"
            @update:modelValue="filterAssignments"
            class="h-[92%] w-full bg-transparent"
            :navigation-max-year-month="`${Number(date.formatDate(Date.now()).substring(0, 4)) + 1}/12`"
            :navigation-min-year-month="`${Number(date.formatDate(Date.now()).substring(0, 4)) - 1}/01`"
          />
          <q-btn class="absolute bottom-2 right-2 z-10" icon="today" flat @click="setToNow">
            <q-tooltip>{{ $t('setDateToNow') }}</q-tooltip>
          </q-btn>
          <q-btn
            class="absolute bottom-2 left-2 z-10"
            icon="pending_actions"
            flat
            @click="
              selectedDate = '0001-01-01';
              filterAssignments();
            "
          >
            <q-tooltip>{{ $t('setDateToFuture') }}</q-tooltip>
          </q-btn>
          <div class="absolute bottom-4 text-center w-full font-bold">
            {{ selectedDate === '0001-01-01' ? 'Future' : selectedDate }}
          </div>
        </q-card>
        <q-card class="card mr-4 flex-1 flex flex-col items-center min-h-[20rem]">
          <div class="text-lg font-bold py-3">{{ $t('userManual') }} & {{ $t('additional') }}{{ $t('setting') }}</div>
          <div>
            <q-card class="card px-4 py-2">
              <div class="font-bold">{{ $t('calendarColorDesc') }}</div>
              <div class="flex items-center my-1">
                <div class="w-2.5 h-2.5 bg-gray-400 rounded-full mr-1"></div>
                {{ $t('none') }}
              </div>
              <div class="flex items-center mb-1">
                <div class="w-2.5 h-2.5 bg-pink-300 rounded-full mr-1"></div>
                {{ $t('mostOf') }}{{ $t('assignment') }}{{ $t('incomplete') }}
              </div>
              <div class="flex items-center mb-1">
                <div class="w-2.5 h-2.5 bg-green-500 rounded-full mr-1"></div>
                {{ $t('moreThanHalfOf') }}{{ $t('assignment') }}{{ $t('completed') }}
              </div>
              <div class="flex items-center">
                <div class="w-2.5 h-2.5 bg-cyan-300 rounded-full mr-1"></div>
                {{ $t('all') }}{{ $t('assignment') }}{{ $t('completed') }}
              </div>
            </q-card>
            <q-card class="card mt-4 px-4 py-2">
              <div class="font-bold">{{ $t('filterOutCourse') }}</div>
              <q-select
                v-model="course"
                @update:modelValue="filterAssignments"
                behavior="dialog"
                :options="courses"
                :option-label="(opt) => (opt === '' ? $t('noFilter') : opt)"
              />
            </q-card>
          </div>
        </q-card>
      </div>
    </q-page>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { date } from 'quasar';
import { api } from 'src/boot/axios';
import AssignmentCard from 'src/components/AssignmentCard.vue';
import Draggable from 'vuedraggable';
import { Assignment } from 'src/components/AssignmentItem.vue';
import { onBeforeMount } from 'vue';
import { ref } from 'vue';
import { onBeforeUnmount } from 'vue';
import { useAppStore } from 'src/stores/app';

const store = useAppStore();

const key = ref(1);
const selectedDate = ref('');
const selectableDates = ref(['']);
const setToNow = () => {
  selectedDate.value = '';
  setTimeout(() => {
    selectedDate.value = date.formatDate(Date.now(), 'YYYY/MM/DD');
    filterAssignments();
  }, 1);
};
const generateEventColor = (date: string): string => {
  const incomplete = assignments.value.filter(
    (val) => val.due.includes(date.replaceAll('/', '-')) && val.status == undefined
  );
  const complete = assignments.value.filter((val) => val.due.includes(date.replaceAll('/', '-')) && val.status == 1);

  if (incomplete.length == 0 && complete.length == 0) {
    return 'grey';
  }

  if (incomplete.length == 0) {
    return 'cyan-3';
  }

  if (incomplete.length <= complete.length) {
    return 'green-5';
  }

  return 'pink-3';
};

const course = ref('');
const courses = ref(['']);
const assignments = ref<Assignment[]>([]);
const filteredAssignments = ref<Assignment[][]>([[], []]);
const filterAssignments = () => {
  filteredAssignments.value[0] = assignments.value.filter(
    (val) =>
      val.due.includes(selectedDate.value.replaceAll('/', '-')) && val.status == undefined && val.from != course.value
  );
  filteredAssignments.value[1] = assignments.value.filter(
    (val) => val.due.includes(selectedDate.value.replaceAll('/', '-')) && val.status == 1 && val.from != course.value
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

onBeforeMount(() => {
  setToNow();
  fetchAssignments(true);
});
window.onfocus = () => fetchAssignments();
onBeforeUnmount(() => (window.onfocus = null));
</script>
