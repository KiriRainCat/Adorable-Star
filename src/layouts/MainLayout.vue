<template>
  <q-layout view="hHh LpR fFf" class="bg max-sm:text-xs">
    <q-header elevated class="glass bg-[rgba(255,226,253,0.4)] text-white h-14 flex">
      <q-toolbar>
        <q-btn size="medium" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title class="-ml-1 max-sm:-ml-4" @click="$router.push('/index')">
          <q-item clickable class="flex items-center max-w-min">
            <q-item-section avatar>
              <q-avatar class="bg-cover w-10 h-10"><img src="/icons/favicon-128x128.png" /></q-avatar>
            </q-item-section>
            <q-item-label class="text-[1.2rem] max-sm:text-[1rem] max-sm:-ml-3 font-semibold">萌媛星</q-item-label>
          </q-item>
        </q-toolbar-title>

        <span class="p-1 flex mr-4 items-center text-end">
          <q-item-section>
            <q-tooltip>{{ $t('fetchTimeDesc') }}</q-tooltip>
            <q-item-label class="max-sm:text-xs">{{ store.getDateString || 'None' }}</q-item-label>
            <q-item-label caption class="text-slate-200 text-[10px]">GPA: {{ gpa || 'None' }}</q-item-label>
          </q-item-section>
        </span>

        <q-btn-dropdown :rounded="!$q.screen.gt.xs" :dense="!$q.screen.gt.xs" dropdown-icon="language" auto-close>
          <div v-for="lang in langs" :key="lang[0]">
            <q-btn flat noCaps class="w-full" @click="changeLocale($i18n, lang[1])">{{ lang[0] }}</q-btn>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
      <q-ajax-bar position="bottom" color="cyan-1" size="2px" />
    </q-header>

    <q-drawer bordered behavior="mobile" side="left" v-model="leftDrawerOpen" class="shadow-lg">
      <q-item-label header>{{ $t('navbar') }}</q-item-label>

      <q-list>
        <NavItemVue v-for="item in navItems" :key="item.title" :="item" class="mb-2" />
      </q-list>

      <q-item class="absolute bottom-0 mb-2 w-full">
        <q-item-section>
          <q-item-label>{{ version }}</q-item-label>
          <q-item-label caption>
            {{ $t('by') + ' ' + $t('author') }}
            <q-tooltip :offset="[0, 50]">KiriRainCat</q-tooltip>
          </q-item-label>
        </q-item-section>
        <q-btn-dropdown class="absolute right-0 mr-20" dropdown-icon="settings" auto-close :menu-offset="[0, 6]">
          <div class="flex flex-col">
            <q-btn flat noCaps class="w-full max-sm:text-xs" @click="changePassword">{{ $t('changePassword') }}</q-btn>
            <q-btn v-if="status >= 10" flat noCaps class="w-full max-sm:text-xs" @click="fetchData">
              {{ $t('fetchData') }}
            </q-btn>
          </div>
        </q-btn-dropdown>
        <q-btn class="absolute right-0 mr-4" @click="onLogout">
          <q-icon name="logout" color="red-4" />
          <q-tooltip>{{ $t('logout') }}</q-tooltip>
        </q-btn>
      </q-item>
    </q-drawer>

    <q-page-container class="glass bg-[rgba(30,30,30,0.25)]">
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
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
import { useRouter } from 'vue-router';
import { useAppStore } from 'src/stores/app';
import { storeToRefs } from 'pinia';
import { onBeforeMount } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import ChangePassword from 'src/components/ChangePassword.vue';
import { api } from 'src/boot/axios';

const $q = useQuasar();
const $router = useRouter();
const store = useAppStore();
const { t } = useI18n();

const status = Number(localStorage.getItem('status'));

const { gpa } = storeToRefs(store);

const navItems: NavItemProps[] = [
  {
    title: 'homepage',
    desc: 'homepageDesc',
    icon: 'dashboard',
    link: '/index',
  },
  {
    title: 'calendarPage',
    desc: 'calendarPageDesc',
    icon: 'event_note',
    link: '/calendar',
  },
  {
    title: 'detailPage',
    desc: 'detailPageDesc',
    icon: 'info',
    link: '/data',
  },
];

const leftDrawerOpen = ref(false);

const ifAdmin = () => {
  if (Number.parseInt(localStorage.getItem('status')!) >= 900) {
    navItems.push({
      title: 'adminPage',
      desc: 'adminPageDesc',
      icon: 'admin_panel_settings',
      link: '/admin',
    });
  }
};

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
};

const onLogout = () => {
  localStorage.setItem('token', '');
  $router.replace('/auth/login');
  $q.notify({ type: 'positive', message: t('logoutSuccess') });
};

const fetchData = () => {
  $q.notify({ type: 'info', message: t('fetchingInProgress') });
  api
    .post('/data/fetch')
    .then(() => {
      api.get('/data/message').catch(() => null);
      $q.notify({ type: 'positive', message: t('fetchSuccess') });
    })
    .catch(() =>
      setTimeout(() => {
        api.get('/data/message').catch(() => null);
        $q.notify({ type: 'positive', message: t('fetchSuccess') });
      }, 180000)
    );
};

const changePassword = () => $q.dialog({ component: ChangePassword });

onBeforeMount(ifAdmin);
</script>
