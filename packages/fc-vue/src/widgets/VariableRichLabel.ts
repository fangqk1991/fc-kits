import { Component, Prop } from 'vue-property-decorator'
import { AttributedLabel } from './AttributedLabel'

@Component({
  mixins: [AttributedLabel],
})
export class VariableRichLabel extends AttributedLabel {
  @Prop({ default: () => new RegExp(/(\{\{\..*?\}\})/) }) regex!: RegExp
}
