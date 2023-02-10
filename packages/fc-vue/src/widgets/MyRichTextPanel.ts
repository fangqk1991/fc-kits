import { Component, Prop } from 'vue-property-decorator'
import '../plugins/element-ui-plugin'
import { ViewController } from '../ViewController'
import { ImagePreviewDialog } from '../dialogs'

@Component({
  template: `<div ref="richText" class="my-rich-text" v-html="htmlContent"/>`,
})
export class MyRichTextPanel extends ViewController {
  @Prop({ default: '', type: String }) readonly htmlContent!: string

  viewDidLoad() {
    const richText = this.$refs.richText as Node
    richText.addEventListener('click', function (event) {
      const target = event.target as Node
      const img = event.target as HTMLElement
      if (target.nodeName === 'IMG') {
        ImagePreviewDialog.show(img.getAttribute('src') as string)
        event.preventDefault()
      }
    })
  }
}
