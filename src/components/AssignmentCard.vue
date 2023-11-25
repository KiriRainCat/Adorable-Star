<template>
  <div class="flex select-none">
    <q-card class="card h-fit w-fit my-1 ml-2">
      <q-item clickable :to="`/data/assignment/${id}`">
        <q-item-section :class="$q.screen.sm ? 'text-[0.6rem]' : ''">
          <q-item-label>{{ title }}</q-item-label>
          <q-item-label caption :class="$q.screen.sm ? 'text-[0.55rem]' : ''">{{ from }}</q-item-label>
        </q-item-section>
      </q-item>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { Assignment } from './AssignmentItem.vue';

defineProps<Assignment>();
</script>
