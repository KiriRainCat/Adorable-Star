<template>
  <div class="flex select-none">
    <q-card class="card h-fit w-fit my-1 ml-2">
      <q-item clickable :to="`/data/assignment/${id}`">
        <q-item-section>
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption>{{ from }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Assignment } from './AssignmentItem.vue';

defineProps<Assignment>();
</script>
