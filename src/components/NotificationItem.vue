<template>
  <q-item clickable class="flex" :to="assignment === undefined ? `/data/course/${from}` : `/data/assignment/${from}`">
    <span v-if="type == undefined" class="w-1 h-8 bg-pink-300 mr-2"></span>
    <span v-if="type == 1" class="w-1 h-8 bg-cyan-300 mr-2"></span>
    <span v-if="type == 2" class="w-1 h-8 bg-indigo-300 mr-2"></span>

    <span class="flex-1">
      <q-item-section>
        <q-item-label>{{ course }}</q-item-label>
        <q-item-label caption>{{ formatTime(created_at) }}</q-item-label>
      </q-item-section>
    </span>

    <span class="flex-1">
      <q-item-section v-if="type == undefined">
        <q-tooltip v-if="assignment!.length > 37">{{ msg.split('|')[1] }}</q-tooltip>

        <q-item-label>
          {{ assignment!.length > 37 ? `${assignment!.substring(0, 39)}...` : assignment }}
        </q-item-label>
        <q-item-label caption>Due: {{ msg }}</q-item-label>
      </q-item-section>

      <q-item-section v-if="type == 1">
        <q-item-label v-if="msg.split('|')[0] === 'Desc'">
          {{ $t('assignment') + $t('directions') + $t('changed') }}
        </q-item-label>
        <q-item-label v-else>
          {{ $t(msg.split('|')[0].toLowerCase()) }} {{ $t('changed') }}: [{{ msg.split('|')[1] }} →
          {{ msg.split('|')[2] }}]
        </q-item-label>
        <q-item-label caption>{{ $t('target') }}: {{ assignment }}</q-item-label>
      </q-item-section>

      <q-item-section v-if="type == 2">
        <q-item-label>{{ msg.split('|')[1] }}</q-item-label>
        <q-item-label caption>
          {{ $t('previousGrade') }}: {{ msg.split('|')[0] === ' ' ? 'None' : msg.split('|')[0] }}
        </q-item-label>
      </q-item-section>
    </span>

    <q-btn flat round @click="onDeleteMsg">
      <q-icon name="close" color="red-10" />
    </q-btn>
  </q-item>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';

export interface Notification {
  id: number;
  from: number;
  type?: number;
  created_at: string;
  course: string;
  assignment?: string;
  msg: string;
}
const props = defineProps<Notification>();

const emit = defineEmits(['delete']);

const formatTime = (raw: string) => {
  return `${raw.substring(5, 7)}/${raw.substring(8, 10)} ` + `${raw.substring(11, 13)}:${raw.substring(14, 16)}`;
};

const onDeleteMsg = () => {
  emit('delete');
  api.delete(`/data/message/${props.id}`).catch(() => null);
};
</script>

<style scoped></style>
