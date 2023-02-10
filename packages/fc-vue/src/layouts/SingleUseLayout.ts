import { Component, ViewController } from '..'

@Component({
  template: `
    <div class="app">
      <router-view class="app-view" :key="uniqueKey()"></router-view>
    </div>
  `,
})
export class SingleUseLayout extends ViewController {
  uniqueKey() {
    return `${Math.random()}`
  }
}
