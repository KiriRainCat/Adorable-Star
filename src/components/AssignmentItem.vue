<template>
  <q-card class="card p-1 mb-4 flex">
    <q-item v-if="detail"></q-item>

    <q-item v-else clickable :to="`/data/assignment/${assignment.id}`" class="flex justify-between items-center flex-1">
      <span v-if="assignment.status == undefined" class="w-2 h-2 bg-pink-300 rounded-full mr-2"></span>
      <span v-if="assignment.status == 1" class="w-2 h-2 bg-cyan-300 rounded-full mr-2"></span>

      <span>
        <q-item-section>{{ formatTime(assignment.due) }}</q-item-section>
      </span>
      <span class="flex-1 ml-8">
        <q-item-section class="font-semibold">{{ assignment.title }}</q-item-section>
      </span>
      <span>
        <q-item-section>{{ assignment.score }}</q-item-section>
      </span>
    </q-item>

    <q-btn flat class="text-cyan-950" icon="book" @click="$emit('update')">
      <q-tooltip>{{ $t('changeStatusTo') }}{{ assignment.status ? $t('incomplete') : $t('complete') }}</q-tooltip>
    </q-btn>
  </q-card>
</template>

<script setup lang="ts">
export interface Assignment {
  id: number;
  from: string;
  status?: number;
  due: string;
  title: string;
  score?: string;
  desc?: string;
}
interface Props {
  assignment: Assignment;
  detail?: boolean;
}
defineProps<Props>();

const formatTime = (raw: string) => {
  if (raw.substring(0, 4) === '0001') {
    return 'Future';
  }
  return `${raw.substring(5, 7)}/${raw.substring(8, 10)}`;
};
</script>

<style scoped></style>
