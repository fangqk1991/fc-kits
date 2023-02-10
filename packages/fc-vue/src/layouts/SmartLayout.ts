import { ViewController, Component, Watch } from '..'

@Component({
  template: `
    <div class="app">
      <router-view class="app-view" :key="getRouterKey()"></router-view>
    </div>
  `,
})
export class SmartLayout extends ViewController {
  suffix: string = ''

  @Watch('$route.query.__refresh')
  onRefresh() {
    if (this.$route.query.__refresh !== undefined) {
      delete this.$route.query.__refresh
      this.suffix = `${Math.random()}`
    }
  }

  getRouterKey() {
    return `${this.$route.path}:${this.suffix}`
  }

  mounted() {
    if (this.$route.query.__refresh !== undefined) {
      const queryParams = Object.assign({}, this.$route.query)
      delete queryParams.__refresh
      this.$router.replace({
        name: this.$route.name!,
        query: queryParams,
      })
    }
  }
}
