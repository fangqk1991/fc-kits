import { ViewController } from '../ViewController'
import { Component } from 'vue-property-decorator'
import { DialogProtocol } from './DialogUtils'

/**
 * @deprecated
 */
@Component
export class DialogBase extends ViewController {
  title = 'Title'
  callback?: Function
  isLoading: boolean = false
  autoDismiss = false

  viewDidLoad() {}
  viewDidAppear() {}

  dismiss() {
    const dialog: DialogProtocol = this.$refs['my-dialog'] as any
    dialog.dismiss()
  }

  show(callback?: Function) {
    if (callback) {
      this.callback = callback
    }
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    this.$mount(dom)
    this.$nextTick(() => {
      this.viewDidAppear()
    })
  }
}
