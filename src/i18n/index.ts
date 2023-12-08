import zhCN from './zh-CN';
import enUS from './en-US';
import koKR from './ko-KR';
import { ExportedGlobalComposer } from 'vue-i18n';

export const messages = {
  'zh-CN': zhCN,
  'en-US': enUS,
  'ko-KR': koKR,
};

export const langs = [
  ['中文', 'zh-CN'],
  ['English', 'en-US'],
  ['한국어', 'ko-KR'],
];

export const changeLocale = (i18n: ExportedGlobalComposer, locale: string) => {
  i18n.locale = locale;
  localStorage.setItem('locale', locale);
};

export const version = 'v0.5.0';
