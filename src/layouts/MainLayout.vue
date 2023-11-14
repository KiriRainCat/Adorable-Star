<template>
  <q-layout view="hHh LpR fFf">
    <q-header elevated class="bg-primary text-white h-14 flex">
      <q-toolbar>
        <q-btn size="medium" dense flat round icon="menu" @click="toggleLeftDrawer" />

        <q-toolbar-title>
          <span class="ml-2 text-[1.2rem] font-semibold">萌媛星</span>
        </q-toolbar-title>

        <q-btn-dropdown dropdown-icon="language" auto-close>
          <div v-for="lang in langs" :key="lang[0]">
            <q-btn flat noCaps class="w-full" @click="changeLocale(lang[1])">{{ lang[0] }}</q-btn>
          </div>
        </q-btn-dropdown>
      </q-toolbar>
    </q-header>

    <q-drawer v-model="leftDrawerOpen" side="left" bordered>
      <q-list>
        <q-item-label header> Essential Links </q-item-label>

        <EssentialLink v-for="link in essentialLinks" :key="link.title" v-bind="link" />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import EssentialLink, { EssentialLinkProps } from 'components/EssentialLink.vue';
import { useI18n } from 'vue-i18n';

const i18n = useI18n();

const essentialLinks: EssentialLinkProps[] = [
  {
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev',
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework',
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev',
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev',
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev',
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev',
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev',
  },
];

const langs = [
  ['中文', 'zh-CN'],
  ['English', 'en-US'],
  ['한국어', 'ko-KR'],
];

const changeLocale = (locale: string) => {
  i18n.locale.value = locale;
  localStorage.setItem('locale', locale);
};

const leftDrawerOpen = ref(false);

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value;
}
</script>
