import { ViewController } from '../ViewController'
import { Component } from 'vue-property-decorator'
import './loading.scss'

@Component({
  template: `
    <div v-if="visible" class="fc-full-screen-mask">
      <div class="fc-loader">{{ title }}</div>
    </div>
  `,
})
export class LoadingView extends ViewController {
  title: string = 'Loading'
  visible = false

  constructor() {
    super()
  }

  public static async loadHandler(message: string, handler: () => Promise<any>) {
    LoadingView.show(message)

    try {
      await handler()
      LoadingView.dismiss()
    } catch (e) {
      LoadingView.dismiss()
      throw e
    }
  }

  public static show(title?: string) {
    if (!_loadingView) {
      _loadingView = new LoadingView()
      const dom = document.createElement('div')
      document.getElementsByTagName('body')[0].appendChild(dom)
      _loadingView.$mount(dom)
    }

    title = title || 'Loading'
    _loadingView.title = title
    _loadingView.visible = true
  }

  public static dismiss() {
    if (_loadingView) {
      _loadingView.visible = false
    }
  }
}

let _loadingView: LoadingView
