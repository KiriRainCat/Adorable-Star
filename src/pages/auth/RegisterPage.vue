<template>
  <q-page class="items-center justify-evenly flex">
    <q-card class="bg-[rgba(255,255,255,0.65)] w-[28rem] h-[38rem] rounded-xl">
      <q-form class="px-12 py-8 text-center mt-[2.5rem]">
        <div class="text-3xl mb-8 font-semibold">{{ $t('registerDesc') }}</div>
        <q-input
          v-model="email"
          :label="$t('email')"
          :rules="[(val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`]"
        />
        <q-input
          v-model="username"
          :label="$t('username')"
          :rules="[(val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`]"
        />
        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :rules="[
            (val) => (val !== '' && val !== null) || $t('noEmptyField'),
            (val) => val.length > 6 || $t('lengthShouldBe') + $t('greaterThan') + '6',
          ]"
        />
        <q-input
          v-model="passwordRepeat"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('passwordAgain')"
          :rules="[
            (val) => (val !== '' && val !== null) || $t('noEmptyField'),
            (val) => val.length > 6 || $t('lengthShouldBe') + $t('greaterThan') + '6',
          ]"
        />
        <div class="cursor-pointer text-blue-500" @click="$router.push('/auth/login')">{{ $t('haveAccount') }}</div>
        <q-btn class="mt-6 px-8 py-2 from-pink-200 to-cyan-200 bg-gradient-to-tr font-bold text-m" noCaps disable>
          {{ $t('register') }}
        </q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const isPwd = ref(true);
const email = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');
</script>

<style scoped lang="scss"></style>
