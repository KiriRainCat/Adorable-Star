<template>
  <q-page class="flex" padding>
    <div class="w-full">
      <q-scroll-area class="h-full" :bar-style="{ opacity: '0' }" :thumb-style="{ opacity: '0' }">
        <course-item class="max-w-[36rem]" v-for="(course, idx) in courses" :key="idx" :="course" />
      </q-scroll-area>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia';
import { api } from 'src/boot/axios';
import CourseItem from 'src/components/CourseItem.vue';
import { useAppStore } from 'src/stores/app';
import { onBeforeUnmount } from 'vue';
import { onBeforeMount } from 'vue';

const store = useAppStore();

const { courses } = storeToRefs(store);

const fetchCourses = (instant?: boolean) => {
  if (Date.now() - new Date(Number(store.fetchedAt)).getTime() < 1800000 && !instant) {
    return;
  }

  api
    .get('/data/course')
    .then((res) => (store.courses = res.data.data.data))
    .catch(() => null);
};

onBeforeMount(() => fetchCourses(true));
window.onfocus = () => fetchCourses();
onBeforeUnmount(() => (window.onfocus = null));
</script>

<style scoped lang="scss"></style>
