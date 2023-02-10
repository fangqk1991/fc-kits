import { AdminApp } from './AdminApp'

declare module 'vue/types/vue' {
  interface Vue {
    $app: AdminApp
  }
}
