<template>
  <q-page class="items-center justify-evenly flex">
    <q-card class="glass bg-[rgba(255,255,255,0.6)] w-[28rem] h-[30rem] rounded-xl">
      <q-form @submit="onSubmit" greedy class="px-12 py-8 text-center mt-[4.5rem]">
        <div class="text-3xl mb-8 font-semibold">{{ $t('completeJupiterInfo') }}</div>
        <q-input
          v-model="name"
          :label="$t('usernameOrId')"
          :rules="[(val) => (val !== '' && val !== null) || `${$t('noEmptyField')}`]"
        />
        <q-input
          v-model="password"
          type="password"
          :label="$t('password')"
          :rules="[(val) => (val !== '' && val !== null) || $t('noEmptyField')]"
        />
        <q-btn
          :loading="submitting"
          type="submit"
          noCaps
          class="mt-6 px-8 py-2 from-pink-200 to-cyan-200 bg-gradient-to-tr font-bold text-m"
        >
          {{ $t('confirm') }}
        </q-btn>
      </q-form>
    </q-card>
  </q-page>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useAccountStore } from 'src/stores/account';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();

const name = ref('');
const password = ref('');
const submitting = ref(false);

const onSubmit = () => {
  submitting.value = true;
  const store = useAccountStore();

  $q.notify({
    type: 'info',
    message: t('verifying'),
  });

  api
    .post('/user/complete-info', { uid: store.uid, account: name.value, password: password.value })
    .then(() => {
      api
        .post('/user/login', { name: store.name, password: store.password })
        .then((res) => {
          store.clear();
          localStorage.setItem('token', res.data.data);
          $q.notify({
            type: 'positive',
            message: t('loginSuccess'),
          });
          $router.replace('/index');
        })
        .catch(() => null);
    })
    .catch((e) => {
      if (e.response.data.code == 417) {
        $q.notify({
          type: 'negative',
          message: t(e.response.data.msg),
        });
      }
    })
    .finally(() => (submitting.value = false));
};
</script>

<style scoped lang="scss"></style>
