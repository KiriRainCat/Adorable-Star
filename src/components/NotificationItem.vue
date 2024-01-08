<template>
  <div>
    <!-- *Desktop* -->
    <div class="flex" v-if="$q.screen.gt.xs">
      <q-item clickable class="flex flex-1" @click="onNotificationClick">
        <span v-if="type == -1" class="w-1 h-8 bg-red-600 mr-2"></span>
        <span v-if="type == undefined" class="w-1 h-8 bg-pink-300 mr-2"></span>
        <span v-if="type == 1" class="w-1 h-8 bg-cyan-300 mr-2"></span>
        <span v-if="type == 2" class="w-1 h-8 bg-indigo-300 mr-2"></span>

        <span class="flex-1">
          <q-item-section>
            <q-item-label>{{ course || $t('system') + $t('notification') }}</q-item-label>
            <q-item-label caption>{{ formatTime(created_at) }}</q-item-label>
          </q-item-section>
        </span>

        <span class="flex-1">
          <q-item-section v-if="type == -1">
            <q-item-label>{{ $t(msg) }}</q-item-label>
            <q-item-label caption>{{ $t('clickToLearnMore') }}</q-item-label>
          </q-item-section>

          <q-item-section v-if="type == undefined">
            <q-tooltip v-if="assignment!.length > 36">{{ assignment }}</q-tooltip>

            <q-item-label>
              {{ assignment!.length > 36 ? `${assignment!.substring(0, 36)}...` : assignment }}
            </q-item-label>
            <q-item-label caption>Due: {{ msg }}</q-item-label>
          </q-item-section>

          <q-item-section v-if="type == 1">
            <q-item-label v-if="msg.split('|')[0] === 'Desc'">
              {{ $t('assignment') + $t('directions') + $t('changed') }}
            </q-item-label>
            <q-item-label v-else-if="msg.split('|')[0] === 'TurnInAble'">
              {{ $t('assignment') + $t('turnInState') + $t('changed') }}
            </q-item-label>
            <q-item-label v-else>
              {{ $t(msg.split('|')[0].toLowerCase()) }}{{ $t('changed') }}: [ {{ msg.split('|')[1] }} → {{ msg.split('|')[2] }} ]
            </q-item-label>
            <q-item-label caption>
              {{ $t('target') }}:
              {{ (assignment?.length || 0) > 32 ? assignment?.substring(0, 32) + '...' : assignment }}
            </q-item-label>
          </q-item-section>

          <q-item-section v-if="type == 2">
            <q-item-label>{{ msg.split('|')[1] }}</q-item-label>
            <q-item-label caption>{{ $t('previousGrade') }}: {{ msg.split('|')[0] === ' ' ? 'None' : msg.split('|')[0] }}</q-item-label>
          </q-item-section>
        </span>
      </q-item>
      <q-btn flat @click="onDeleteMsg">
        <q-icon name="close" color="red-10" />
      </q-btn>
    </div>

    <!-- *Mobile* -->
    <div class="flex" v-else>
      <div class="absolute left-2 mt-2">
        <div v-if="type == -1" class="w-1 h-12 bg-red-600 mr-2"></div>
        <div v-if="type == undefined" class="w-1 h-12 bg-pink-300 mr-2"></div>
        <div v-if="type == 1" class="w-1 h-12 bg-cyan-300 mr-2"></div>
        <div v-if="type == 2" class="w-1 h-12 bg-indigo-300 mr-2"></div>
      </div>

      <q-item clickable class="flex-1 flex flex-col ml-1" @click="onNotificationClick">
        <q-item-section>
          <q-item-label class="text-[0.6rem]">
            {{ course || $t('system') + $t('notification') }}
            <span class="text-[0.55rem] text-gray-600">( {{ formatTime(created_at) }} )</span>
          </q-item-label>
        </q-item-section>

        <div class="mt-0.5">
          <q-item-section v-if="type == -1">
            <q-item-label class="-mb-0.5">{{ $t(msg) }}</q-item-label>
            <q-item-label caption>{{ $t('clickToLearnMore') }}</q-item-label>
          </q-item-section>

          <q-item-section v-if="type == undefined">
            <q-tooltip v-if="assignment!.length > 37">{{ msg.split('|')[1] }}</q-tooltip>

            <q-item-label class="-mb-0.5">
              {{ assignment!.length > 37 ? `${assignment!.substring(0, 39)}...` : assignment }}
            </q-item-label>
            <q-item-label caption>Due: {{ msg }}</q-item-label>
          </q-item-section>

          <q-item-section v-if="type == 1">
            <q-item-label v-if="msg.split('|')[0] === 'Desc'" class="-mb-0.5">
              {{ $t('assignment') + $t('directions') + $t('changed') }}
            </q-item-label>
            <q-item-label v-else class="-mb-0.5">
              {{ $t(msg.split('|')[0].toLowerCase()) }}{{ $t('changed') }}: [ {{ msg.split('|')[1] }} → {{ msg.split('|')[2] }} ]
            </q-item-label>
            <q-item-label caption>{{ $t('target') }}: {{ assignment }}</q-item-label>
          </q-item-section>

          <q-item-section v-if="type == 2">
            <q-item-label class="-mb-0.5">{{ msg.split('|')[1] }}</q-item-label>
            <q-item-label caption>{{ $t('previousGrade') }}: {{ msg.split('|')[0] === ' ' ? 'None' : msg.split('|')[0] }}</q-item-label>
          </q-item-section>
        </div>
      </q-item>
      <q-btn flat @click="onDeleteMsg">
        <q-icon name="close" color="red-10" />
      </q-btn>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

const $q = useQuasar();
const $router = useRouter();
const { t } = useI18n();

export interface Notification {
  id: number;
  from?: number;
  type?: number;
  created_at: string;
  course?: string;
  assignment?: string;
  msg: string;
}
const props = defineProps<Notification>();

const emit = defineEmits(['delete']);

const formatTime = (raw: string) => {
  const date = new Date(Date.parse(raw)).toLocaleString();
  return `${date.substring(5, date.length - 3)}`;
};

const onDeleteMsg = () => {
  emit('delete');
  api.delete(`/data/message/${props.id}`).catch(() => null);
};

const onNotificationClick = () => {
  if (props.type == -1 && props.msg.includes('cfToken')) {
    const dialog = $q.dialog({
      title: t('renewCfToken'),
      message: t('newCfToken') + '<br><a target="_blank" href="doc/cf-cookie">查看获取方式</a>',
      html: true,
      prompt: {
        model: '',
        isValid: (val) => val.length > 5,
      },
      cancel: true,
    });

    dialog.onOk((payload) => {
      api
        .put(`/user/cfbp/${payload}`)
        .then(() => {
          const status = Number(localStorage.getItem('status'));
          $q.notify({
            type: 'positive',
            message: t('cfbpRenewed') + (status >= 1 ? t('cfbpImmediate') : t('cfbpNormal')),
          });
          if (status >= 1) {
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
          }
        })
        .catch(() => null);
    });
    return;
  }

  if (props.type == -1 && props.msg.includes('browserProxyErr')) {
    const dialog = $q.dialog({
      title: '切换回代理浏览器？',
      prompt: {
        hint: '管理员验证',
        model: '',
        isValid: (val) => val.length > 6,
      },
      ok: true,
      cancel: true,
    });

    dialog.onOk((payload) =>
      api
        .post('/admin/switch-browser/1', {}, { headers: { Admin: payload } })
        .then(() => $q.notify({ type: 'positive', message: '切换成功' }))
        .catch(() => null)
    );
    return;
  }

  if (props.assignment === undefined) {
    $router.push(`/data/course/${props.from}`);
  } else {
    $router.push(`/data/assignment/${props.from}`);
  }
};
</script>
