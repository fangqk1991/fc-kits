import { ViewController } from '../ViewController'
import { Component } from 'vue-property-decorator'
import { DialogCallback } from './DialogUtils'
import { TypicalDialogView } from './TypicalDialogView'

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" :callback="callback" :cancel-callback="cancelCallback">
      <slot />
    </typical-dialog-view>
  `,
})
export class TypicalDialog<T = any> extends ViewController {
  title = 'Title'
  callback = async () => {}
  cancelCallback = () => {}
  result: any = undefined

  viewDidLoad() {}
  viewDidAppear() {}

  dialogView() {
    return this.$refs['my-dialog'] as TypicalDialogView
  }

  async onConfirm() {
    await this.dialogView()?.onClickConfirm()
  }

  dismiss() {
    this.dialogView()?.dismiss()
  }

  onHandleResult(result: any) {
    return result
  }

  onCustomSubmit(result: any) {
    return result
  }

  show(callback: DialogCallback<T>) {
    this.callback = async () => {
      let result = await this.onHandleResult(this.result)
      result = await this.onCustomSubmit(result)
      await callback(result)
    }
    this.loadView()
  }

  loadView() {
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    this.$mount(dom)
    this.$nextTick(() => {
      this.viewDidAppear()
    })
  }
}
