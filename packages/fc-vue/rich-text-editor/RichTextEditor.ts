import { ViewController, Component } from '../src'
import { TextEditor } from './text-editor'

@Component({
  mixins: [TextEditor],
})
export class RichTextEditor extends ViewController {
  defaultModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ list: 'ordered' }, { list: 'bullet' }],
      [{ indent: '-1' }, { indent: '+1' }],
      [{ size: ['small', false, 'large', 'huge'] }],
      [{ header: [1, 2, 3, 4, 5, 6, false] }],
      [{ color: [] }, { background: [] }],
      ['link'],
    ],
  }
}
