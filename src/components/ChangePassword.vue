<template>
  <q-dialog ref="dialogRef" @hide="onDialogHide">
    <q-card class="p-6 min-w-[24rem]">
      <div class="text-lg font-bold mb-2">{{ $t('changePassword') }}</div>
      <q-form greedy @submit="onSubmit">
        <q-input
          type="password"
          v-model="password"
          :label="$t('originalPassword')"
          :rules="[(val) => val.length > 6 || t('lengthShouldBe') + t('greaterThan') + '6']"
        />
        <q-input
          type="password"
          v-model="newPassword"
          :label="$t('newPassword')"
          :rules="[(val) => val.length > 6 || t('lengthShouldBe') + t('greaterThan') + '6']"
        />
        <q-input
          type="password"
          v-model="newPasswordRepeat"
          :label="$t('repeat') + $t('newPassword')"
          :rules="[
            (val) => val.length > 6 || t('lengthShouldBe') + t('greaterThan') + '6',
            (val) => val == newPassword || t('passwordShouldBeEqual'),
          ]"
        />
        <q-btn class="mt-4" type="submit" primary :loading="loading">{{ $t('confirm') }}</q-btn>
      </q-form>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();

defineEmits([...useDialogPluginComponent.emits]);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const password = ref('');
const newPassword = ref('');
const newPasswordRepeat = ref('');
const loading = ref(false);

const onSubmit = () => {
  loading.value = true;
  api
    .put('/user/password', { password: password.value, new_password: newPassword.value })
    .then(() => {
      onDialogOK();
      localStorage.setItem('token', '');
      $router.push('/auth/login');
      $q.notify({ type: 'positive', message: t('passwordChangeSuccess') });
    })
    .catch(() => null)
    .finally(() => (loading.value = false));
};
</script>
