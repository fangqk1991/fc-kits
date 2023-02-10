import { Component } from 'vue-property-decorator'
import { ViewController } from './ViewController'

@Component({
  template: `
    <div v-if="!isReady" v-loading="true" style="width: 100vw; height: 100vh;" />
    <router-view v-else />
  `,
})
export class RootView extends ViewController {
  isReady = false
}
