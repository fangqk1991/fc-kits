import Vue from 'vue'
import VueI18n from 'vue-i18n'

Vue.use(VueI18n)

export interface LocaleDict {
  [p: string]: { en: string; [p: string]: string }
}

export const i18n = new VueI18n({
  locale: 'en',
  messages: {
    en: {},
    zh: {},
  },
})

export const extendsI18n = (dict: LocaleDict, localeKeys = ['en', 'zh']) => {
  const customDictData = {}
  for (const localeKey of localeKeys) {
    if (!i18n.messages[localeKey]) {
      i18n.messages[localeKey] = {}
    }
    customDictData[localeKey] = {}
  }
  Object.keys(dict).forEach((key) => {
    const data = dict[key]
    for (const localeKey of localeKeys) {
      customDictData[localeKey][key] = data[localeKey] || key
    }
  })
  for (const localeKey of localeKeys) {
    i18n.mergeLocaleMessage(localeKey, customDictData[localeKey])
  }
}
