<template>
  <q-page class="flex" padding>
    <div class="w-full">
      <q-scroll-area class="h-full min-w-[22rem] max-w-[36rem]">
        <course-item v-for="(course, idx) in courses" :key="idx" :="course" />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import CourseItem, { Course } from 'src/components/CourseItem.vue';
import { onBeforeUnmount } from 'vue';
import { ref } from 'vue';
import { onBeforeMount } from 'vue';

const courses = ref<Course[]>([]);

const fetchCourses = () => {
  api
    .get('/data/course')
    .then((res) => (courses.value = res.data.data.data))
    .catch(() => null);
};

onBeforeMount(() => fetchCourses());
window.onfocus = fetchCourses;
onBeforeUnmount(() => (window.onfocus = null));
</script>

<style scoped lang="scss"></style>
