import { Vue } from 'vue-property-decorator'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// @ts-ignore
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'
// @ts-ignore
import enLocale from 'element-ui/lib/locale/lang/en'
import { i18n } from '../i18n'

i18n.mergeLocaleMessage('en', enLocale)
i18n.mergeLocaleMessage('zh', zhLocale)

Vue.use(ElementUI, {
  i18n: (key: string, value: any) => i18n.t(key, value),
})

export { ElementUI }
