import { Vue } from 'vue-property-decorator'
import { CommonPicker } from './pickers'

Vue.prototype.$whitespace = '　'

Vue.prototype.$devEgg = function () {
  return this.$route && '_devEgg' in this.$route.query
}

Vue.component('common-picker', CommonPicker)
