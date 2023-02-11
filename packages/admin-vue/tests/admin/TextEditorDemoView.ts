import { Component, ViewController } from '@fangcha/vue'
import { RichTextEditor, TextEditor } from '@fangcha/vue/rich-text-editor'

@Component({
  components: {
    'text-editor': TextEditor,
    'rich-text-editor': RichTextEditor,
  },
  template: `
    <div>
    <el-card>
      <h4>TextEditor</h4>
      <text-editor placeholder="Please input message" :is-based64="true" />
    </el-card>
    <el-card class="mt-4">
      <h4>RichTextEditor</h4>
      <text-editor placeholder="Please input message" />
    </el-card>
    </div>
  `,
})
export class TextEditorDemoView extends ViewController {}
