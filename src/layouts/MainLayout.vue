<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white h-14 flex">
      <q-toolbar>
        <q-btn size="medium" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="-ml-1" @click="$router.push('/')">
          <q-item clickable class="flex items-center max-w-min">
            <q-item-section avatar>
              <q-avatar class="bg-cover w-10 h-10"><img src="/icons/favicon-128x128.png" /></q-avatar>
            </q-item-section>
            <q-item-label class="text-[1.2rem] font-semibold">萌媛星</q-item-label>
          </q-item>
        </q-toolbar-title>

        <span class="p-1 flex mr-4 items-center text-end">
          <q-item-section>
            <q-tooltip>{{ $t('fetchTimeDesc') }}</q-tooltip>
            <q-item-label>11/16 17:25</q-item-label>
            <q-item-label caption class="text-slate-200 text-[10px]">GPA: 4.67</q-item-label>
          </q-item-section>
        </span>

        <q-btn-dropdown dropdown-icon="language" auto-close>
          <div v-for="lang in langs" :key="lang[0]">
            <q-btn flat noCaps class="w-full" @click="changeLocale($i18n, lang[1])">{{ lang[0] }}</q-btn>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer bordered side="left" v-model="leftDrawerOpen" class="shadow-lg">
      <q-item-label header>{{ $t('navbar') }}</q-item-label>

      <q-list>
        <NavItemVue v-for="item in navItems" :key="item.title" :="item" class="mb-2" />
      </q-list>

      <q-item class="absolute bottom-0 mb-2 w-full">
        <q-item-section>
          <q-item-label>{{ version }}</q-item-label>
          <q-item-label caption>{{ $t('by') + $t('author') }}</q-item-label>
        </q-item-section>
        <q-btn class="absolute right-0 mr-4" @click="onLogout">
          <q-icon name="logout" color="red-4" />
        </q-btn>
      </q-item>
    </q-drawer>

    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import NavItemVue, { NavItemProps } from 'components/NavItem.vue';
import { changeLocale, langs, version } from 'src/i18n';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $router = useRouter();
const { t } = useI18n();

const navItems: NavItemProps[] = [
  {
    title: t('homepage'),
    desc: t('homepageDesc'),
    icon: 'dashboard',
    link: '/',
  },
  {
    title: t('calendarPage'),
    desc: t('calendarPageDesc'),
    icon: 'event_note',
    link: '/',
  },
  {
    title: t('detailPage'),
    desc: t('detailPageDesc'),
    icon: 'info',
    link: '/',
  },
  {
    title: t('adminPage'),
    desc: t('adminPageDesc'),
    icon: 'admin_panel_settings',
    link: '/',
  },
];

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const onLogout = () => {
  localStorage.setItem('token', '');
  $router.replace('/auth/login');
};
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
</style>
