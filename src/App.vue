<template>
  <router-view />
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

onMounted(() => {
  i18n.locale.value = localStorage.getItem('locale')!;
});
</script>
