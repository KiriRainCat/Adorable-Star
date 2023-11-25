<template>
  <q-card class="card p-1 m-4">
    <q-item clickable :to="`/data/course/${id}`" class="flex items-center">
      <span>
        <q-item-section>
          <q-item-label class="font-bold max-sm:text-xs">{{ title }}</q-item-label>
        </q-item-section>
      </span>
      <span class="flex-1" />
      <span>
        <q-item-section>
          <q-item-label class="max-sm:text-xs">{{ percent_grade }} {{ letter_grade }}</q-item-label>
        </q-item-section>
      </span>
    </q-item>
  </q-card>
</template>

<script setup lang="ts">
export interface Course {
  id: number;
  title: string;
  percent_grade?: string;
  letter_grade?: string;
}
defineProps<Course>();
</script>

<style scoped></style>
