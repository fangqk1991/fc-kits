import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

@Component({
  template: `<pre class="my-pre bordered-content">{{ valueStr }}</pre>`,
})
export class JsonPre extends ViewController {
  @Prop({ default: () => {}, type: [Object, String] }) readonly value!: {} | string

  get valueStr() {
    if (!this.value) {
      return ''
    }
    if (typeof this.value === 'string') {
      let content = this.value
      try {
        content = JSON.stringify(JSON.parse(content), null, 2)
      } catch (e) {}
      return content
    }
    return JSON.stringify(this.value, null, 2)
  }
}
