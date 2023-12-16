<template>
  <q-dialog ref="dialogRef" full-height full-width persistent @hide="onDialogHide">
    <q-card class="p-6 min-w-[24rem]">
      <div class="text-lg font-bold mb-2">Juno Doc</div>
      <q-card class="mt-4">
        <div>
          <q-input v-model="title" class="mb-4 px-2" :label="'Juno Doc ' + $t('title')" />
          <q-editor max-height="64vh" height="48vh" v-model="text" :toolbar="[['left'], ['undo', 'redo']]" />
        </div>
      </q-card>
      <q-btn class="mt-4 mr-3" @click="onSubmit" color="green" noCaps>{{ $t('upload') }}</q-btn>
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

const title = ref('');
const text = ref('');

const onSubmit = () => {
  // Validate title and content
  if (title.value === '') {
    $q.notify({ type: 'negative', message: t('titleEmpty') });
    return;
  }
  if (text.value === '') {
    $q.notify({ type: 'negative', message: t('contentEmpty') });
    return;
  }

  $q.loading.show();
  api
    .post(`/data/assignment/upload/juno-doc/${props.id}`, { text: `${title.value}|${text.value}` })
    .then(() => $q.notify({ type: 'positive', message: t('upload') + t('success') }))
    .catch(() => null)
    .finally(() => {
      props.refreshFn();
      $q.loading.hide();
      onDialogOK();
    });

  return {};
};
</script>
