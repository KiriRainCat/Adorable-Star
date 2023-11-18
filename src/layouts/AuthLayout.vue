<template>
  <q-layout view="hHh LpR fFf" class="bg">
    <div class="glass">
      <q-header elevated class="glass bg-[rgba(255,221,252,0.4)] text-white h-14 flex">
        <q-toolbar>
          <q-toolbar-title @click="$router.push('/index')">
            <q-item clickable class="flex items-center max-w-min">
              <q-item-section avatar>
                <q-avatar class="bg-cover w-10 h-10"><img src="/icons/favicon-128x128.png" /></q-avatar>
              </q-item-section>
              <q-item-label class="text-[1.2rem] font-semibold">萌媛星</q-item-label>
            </q-item>
          </q-toolbar-title>

          <q-btn-dropdown dropdown-icon="language" auto-close>
            <div v-for="lang in langs" :key="lang[0]">
              <q-btn flat noCaps class="w-full" @click="changeLocale($i18n, lang[1])">{{ lang[0] }}</q-btn>
            </div>
          </q-btn-dropdown>
        </q-toolbar>
      </q-header>

      <q-page-container>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </q-page-container>
    </div>
  </q-layout>
</template>

<script setup lang="ts">
import { changeLocale, langs } from 'src/i18n';
</script>

<style scoped lang="scss">
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.bg {
  background-image: url('../assets/bg.png');
  background-size: cover;
  background-position: bottom;
}
</style>
