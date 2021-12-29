import Vue from 'vue'
import VueI18n from 'vue-i18n'
import elementEnLocale from 'element-ui/lib/locale/lang/en' // element-ui lang
import elementZhLocale from 'element-ui/lib/locale/lang/zh-CN'// element-ui lang
import enLocale from '@/locales/en'
import zhLocale from '@/locales/zh-cn'
import store from '@/store';

Vue.use(VueI18n)

const messages = {
  'en': {
    ...enLocale,
    ...elementEnLocale
  },
  'zh-cn': {
    ...zhLocale,
    ...elementZhLocale
  }
}
export default new VueI18n({
  locale: store.state.Session.language,
  fallbackLocale: 'zh-cn',
  messages
})
