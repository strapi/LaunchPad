// index.js
import { createI18n } from 'vue-i18n'
import en from './lang/en'
import zh from './lang/zh'
import de from './lang/de'
import es from './lang/es'
import fr from './lang/fr'
import ja from './lang/ja'
import kr from './lang/kr'
import pt from './lang/pt'
import tr from './lang/tr'
import tw from './lang/tw'
import vi from './lang/vi'

const messages = {
  en,
  zh,
  de,
  es,
  fr,
  ja,
  kr,
  pt,
  tr,
  tw,
  vi
}
const language = (navigator.language || 'en').toLocaleLowerCase() // 这是获取浏览器的语言
const i18n = createI18n({
  locale: localStorage.getItem('lang') || language.split('-')[0] || 'en', // 首先从缓存里拿，没有的话就用浏览器语言，
  // locale: 'en', // 首先从缓存里拿，没有的话就用浏览器语言，
  fallbackLocale: 'en', // 设置备用语言
  messages,
  legacy: false, // 处理 Uncaught SyntaxError: Not available in legacy mode 的问题
})

export default i18n

