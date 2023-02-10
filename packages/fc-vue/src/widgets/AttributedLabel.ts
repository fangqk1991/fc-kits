import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../ViewController'

@Component({
  template: `
    <span>
      <template v-for="(text, index) in textChunks">
        <span class="text-danger" v-if="index % 2 === 1">{{ text }}</span>
        <template v-else>{{ text }}</template>
      </template>
    </span>
  `,
})
export class AttributedLabel extends ViewController {
  @Prop({ default: null }) regex!: RegExp
  @Prop({ default: '', type: String }) text!: string

  get textChunks() {
    return `${this.text}`.split(this.regex)
  }
}
