<template>
  <q-page class="items-center justify-evenly flex">
    <q-card class="bg-[rgba(255,255,255,0.65)] w-[28rem] h-[42rem] rounded-xl">
      <q-form class="px-12 py-8 text-center mt-[2.4rem]" @submit="register">
        <div class="text-3xl mb-8 font-semibold">{{ $t('registerDesc') }}</div>
        <q-input
          v-model="email"
          :label="$t('email')"
          :rules="[(val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`]"
        />
        <div class="flex items-center">
          <q-input
            class="flex-1"
            v-model="validationCode"
            :label="$t('validationCode')"
            :rules="[
              (val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`,
              (val) => val.length == 6 || $t('lengthShouldBe') + $t('equalTo') + '6',
            ]"
          />
          <q-btn
            class="w-20 ml-4 from-pink-200 to-cyan-200 bg-gradient-to-tr font-bold text-m"
            noCaps
            @click="sendValidationCode"
            :disable="cd != 0 || !RegExp(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/).test(email)"
          >
            {{ cd == 0 ? $t('send') : cd + 's' }}
          </q-btn>
        </div>
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
            (val) => val == password || $t('passwordShouldBeEqual'),
          ]"
        />
        <div class="cursor-pointer text-blue-500" @click="$router.push('/auth/login')">{{ $t('haveAccount') }}</div>
        <q-btn class="mt-6 px-8 py-2 from-pink-200 to-cyan-200 bg-gradient-to-tr font-bold text-m" noCaps type="submit">
          {{ $t('register') }}
        </q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();

const isPwd = ref(true);
const email = ref('');
const validationCode = ref('');
const username = ref('');
const password = ref('');
const passwordRepeat = ref('');

const cd = ref(0);

const sendValidationCode = () => {
  cd.value = 180;
  api
    .post(`/user/validation-code/${email.value}`)
    .then(() => {
      $q.notify({ type: 'positive', message: t('send') + t('success') });
      const interval = setInterval(() => {
        if (cd.value > 0) {
          cd.value--;
        } else {
          clearInterval(interval);
        }
      }, 1000);
    })
    .catch(() => (cd.value = 0));
};
const register = () => {
  api
    .post('/user/register', {
      email: email.value,
      validation_code: validationCode.value,
      username: username.value,
      password: password.value,
    })
    .then(() => {
      $q.notify({ type: 'positive', message: t('register') + t('success') + ' ' + t('pleaseLogin') });
      $router.replace('/auth/login');
    })
    .catch(() => null);
};
</script>

<style scoped lang="scss"></style>
