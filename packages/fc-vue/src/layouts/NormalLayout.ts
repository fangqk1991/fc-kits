import { Component, ViewController } from '..'

@Component({
  template: `
    <div class="app">
      <router-view class="app-view"></router-view>
    </div>
  `,
})
export class NormalLayout extends ViewController {}
