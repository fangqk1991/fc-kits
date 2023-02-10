import { ViewController } from '../ViewController'
import { Component } from 'vue-property-decorator'
import { TypicalDialogView } from './TypicalDialogView'
import { CustomDialogView } from './CustomDialogView'
import { DialogCallback } from './DialogUtils'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
  },
  template: `
    <custom-dialog-view ref="my-dialog" :title="title">
      <slot />
    </custom-dialog-view>
  `,
})
export class CustomDialog<T = any> extends ViewController {
  title = 'Title'
  callback: DialogCallback<T> | null = null

  viewDidLoad() {}
  viewDidAppear() {}

  dialogView() {
    return this.$refs['my-dialog'] as TypicalDialogView
  }

  dismiss() {
    this.dialogView()?.dismiss()
  }

  loadView() {
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    this.$mount(dom)
    this.$nextTick(() => {
      this.viewDidAppear()
    })
  }

  show(callback?: DialogCallback<T>) {
    if (callback) {
      this.callback = callback
    }
    this.loadView()
  }
}
