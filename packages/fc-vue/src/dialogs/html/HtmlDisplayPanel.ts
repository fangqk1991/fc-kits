import { Component, Model, Prop, Watch } from 'vue-property-decorator'
import { ViewController } from '../../ViewController'
import { HtmlEditorDialog } from './HtmlEditorDialog'

@Component({
  template: `
    <div>
      <div v-if="editable" class="mb-2">
        <a href="javascript:" @click="onEdit">点击编辑</a>
      </div>
      <iframe v-if="showIframe" width="100%" height="100%" :srcdoc="myValue" />
    </div>
  `,
})
export class HtmlDisplayPanel extends ViewController {
  @Prop({ default: false, type: Boolean }) readonly showIframe!: boolean
  @Prop({ default: true, type: Boolean }) readonly editable!: boolean

  @Model('update:value', { type: String, default: '' }) readonly value!: string
  myValue: string = ''

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  onDataChanged() {
    this.$emit('update:value', this.myValue)
    this.$emit('change', this.myValue)
  }

  onEdit() {
    const dialog = HtmlEditorDialog.dialogForEdit(this.myValue)
    dialog.show((userEmail: string) => {
      this.myValue = userEmail
      this.onDataChanged()
    })
  }
}
