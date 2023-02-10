import { BasicAppProtocol } from './BasicAppProtocol'

declare module 'vue/types/vue' {
  interface Vue {
    $app: BasicAppProtocol
  }
}
