<template>
  <q-dialog ref="dialogRef" persistent @hide="onDialogHide">
    <q-card class="p-6 min-w-[24rem]">
      <div class="text-lg font-bold mb-2">{{ $t('uploadFiles') }}</div>
      <q-card class="mt-4">
        <div>
          <q-uploader
            ref="uploaderRef"
            :factory="onSubmit"
            batch
            multiple
            max-file-size="16777216"
            @rejected="onRejected"
            color="white"
            text-color="black"
          />
        </div>
      </q-card>
      <q-btn class="mt-4 mr-3" @click="() => uploaderRef.upload()" color="green" noCaps>{{ $t('upload') }}</q-btn>
      <q-btn class="mt-4" @click="onDialogOK" color="grey" noCaps>{{ $t('cancel') }}</q-btn>
    </q-card>
  </q-dialog>
</template>

<script setup lang="ts">
import { useDialogPluginComponent, useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const $q = useQuasar();
const { t } = useI18n();

defineEmits([...useDialogPluginComponent.emits]);
const props = defineProps(['id', 'refreshFn']);
const { dialogRef, onDialogHide, onDialogOK } = useDialogPluginComponent();

const uploaderRef = ref();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const onSubmit = (files: readonly File[]) => {
  $q.loading.show();

  let data = new FormData();
  Array.from(files).forEach((file) => {
    data.append('files', file);
  });

  api
    .post(`/data/assignment/upload/files/${props.id}`, data, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then(() => $q.notify({ type: 'positive', message: t('upload') + t('success') }))
    .catch(() => null)
    .finally(() => {
      props.refreshFn();
      $q.loading.hide();
      onDialogOK();
    });

  return {};
};

const onRejected = () => {
  $q.notify({
    type: 'negative',
    message: t('fileTooLarge'),
  });
};
</script>
