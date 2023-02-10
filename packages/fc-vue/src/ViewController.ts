import { Component, Vue } from 'vue-property-decorator'
import { i18n } from './i18n'
import { RawLocation } from 'vue-router'

@Component
export class ViewController extends Vue {
  public isLoading: boolean = false
  LS = i18n.t.bind(i18n)

  get _this() {
    return this
  }

  mounted() {
    this.viewDidLoad()
  }

  beforeDestroy() {
    this.viewWillUnload()
  }

  viewDidLoad() {}

  viewWillUnload() {}

  async execHandler<T = any>(handler: () => Promise<T>) {
    this.isLoading = true
    try {
      const result = await handler()
      this.isLoading = false
      return result
    } catch (e) {
      this.isLoading = false
      throw e
    }
  }

  $saveQueryParams(params: {}) {
    const queryParams = Object.assign({}, this.$route.query)

    Object.keys(params).forEach((key) => {
      if (params[key] !== undefined || params[key] !== null) {
        queryParams[key] = params[key]
      }
    })

    return this.$router.replace({
      name: this.$route.name!,
      query: queryParams,
    })
  }

  $goto(location: RawLocation) {
    return this.$router.push(location)
  }
}
