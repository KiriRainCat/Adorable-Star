<template>
  <q-page class="flex" padding>
    <div>
      <q-scroll-area class="h-[92%] w-[40rem]">
        <q-list>
          <course-item v-for="(course, idx) in courses" :key="idx" :="course" />
        </q-list>
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import CourseItem, { Course } from 'src/components/CourseItem.vue';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

const courses = ref<Course[]>([]);

onBeforeMount(() => {
  api
    .get('/data/course', { headers: { Instant: 'true' } })
    .then((res) => (courses.value = res.data.data.data))
    .catch(() => null);
});
</script>

<style scoped lang="scss"></style>
