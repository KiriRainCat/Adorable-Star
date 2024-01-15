<template>
  <q-page class="items-center justify-evenly flex">
    <q-card class="bg-[rgba(255,255,255,0.65)] w-[28rem] h-[30rem] rounded-xl">
      <q-form @submit="onSubmit" greedy class="px-12 py-8 text-center mt-[3.8rem]">
        <div class="text-3xl mb-8 font-semibold">{{ $t('loginDesc') }}</div>
        <q-input v-model="name" :label="$t('usernameOrEmail')" :rules="[(val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`]">
          <template #prepend>
            <q-icon name="person" />
          </template>
        </q-input>
        <q-input
          v-model="password"
          :type="isPwd ? 'password' : 'text'"
          :label="$t('password')"
          :rules="[
            (val) => (val !== '' && val !== null) || $t('noEmptyField'),
            (val) => val.length > 6 || $t('lengthShouldBe') + $t('greaterThan') + '6',
          ]"
        >
          <template #prepend>
            <q-icon name="lock" />
          </template>
        </q-input>
        <div class="cursor-pointer text-blue-500" @click="$router.push('/auth/register')">{{ $t('noAccount') }}</div>
        <q-btn
          :loading="submitting"
          type="submit"
          noCaps
          class="mt-6 px-8 py-2 text-m from-pink-200 to-cyan-200 bg-gradient-to-tr font-bold"
        >
          {{ $t('login') }}
        </q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useAccountStore } from 'src/stores/account';
import { useAppStore } from 'src/stores/app';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();

const isPwd = ref(true);
const name = ref('');
const password = ref('');
const submitting = ref(false);

const onSubmit = () => {
  submitting.value = true;
  api
    .post('/user/login', { name: name.value, password: password.value })
    .then((res) => {
      localStorage.setItem('token', res.data.data.split('|')[0]);
      localStorage.setItem('status', res.data.data.split('|')[1]);

      $q.notify({
        type: 'positive',
        message: t('loginSuccess'),
      });
      $router.replace('/index');

      const store = useAppStore();
      api
        .get('/data/message')
        .then((res) => store.updateNotifications(res.data.data.data))
        .catch(() => null);

      // 用户长时间未登录的数据大更新
      if (res.data.data.split('|')[2] === 'true') {
        $q.notify({
          type: 'positive',
          timeout: 10000,
          message: t('longTimeNoSee'),
        });
        $q.loading.show({ message: t('longTimeNoSee') });

        api
          .post('/data/fetch')
          .then(() => $q.notify({ type: 'positive', message: t('fetchSuccess') }))
          .catch(() => null)
          .finally(() => $q.loading.hide());
      }
    })
    .catch((e) => {
      if (e.response.data.code == 428) {
        $q.notify({
          type: 'info',
          message: t(e.response.data.msg),
        });

        // Store user account info for automatic login after completing Jupiter info
        const store = useAccountStore();
        store.uid = e.response.data.data;
        store.name = name.value;
        store.password = password.value;

        $router.replace('/auth/complete-info');
      }
    })
    .finally(() => (submitting.value = false));
};
</script>

<style scoped lang="scss"></style>
