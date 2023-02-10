import { Component, Model, Watch } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

// @ts-ignore
import { codemirror } from 'vue-codemirror'

import 'codemirror/lib/codemirror.css'
import 'codemirror/theme/paraiso-dark.css'
import 'codemirror/mode/xml/xml.js'
import 'codemirror/mode/css/css.js'
import 'codemirror/addon/hint/html-hint.js'

@Component({
  components: {
    codemirror: codemirror,
  },
  template: `
    <codemirror style="line-height: 18px;" :value="myValue" :options="cmOptions" @input="onContentChange"></codemirror>
  `,
})
export class CodeEditor extends ViewController {
  @Model('update:value', { default: '' }) readonly value!: string

  myValue: string = ''
  cmOptions = {
    tabSize: 2,
    mode: 'text/html',
    theme: 'paraiso-dark',
    lineNumbers: true,
    line: true,
    lineWrapping: true,
  }

  @Watch('value', { immediate: true, deep: true })
  onValueChanged(val: string) {
    this.myValue = val
  }

  viewDidLoad() {
    this.onValueChanged(this.value)
  }

  onContentChange(newVal: string) {
    this.myValue = newVal
    this.$emit('update:value', newVal)
    this.$emit('change', newVal)
  }
}
