import { ViewController, Component } from '..'

@Component({
  template: `
    <div class="app">
      <router-view class="app-view" :key="$route.path"></router-view>
    </div>
  `,
})
export class TypicalLayout extends ViewController {}
