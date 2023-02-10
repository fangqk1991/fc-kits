<template>
  <div class="quill-editor">
    <slot name="toolbar"></slot>
    <div ref="editor"></div>
  </div>
</template>

<script>
import Quill from 'quill'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'

import { ImageDrop } from './imagedrop'
import { ImageResize } from './imageresize'

Quill.register('modules/imageDrop', ImageDrop)
Quill.register('modules/imageResize', ImageResize)
export default {
  name: 'VueQuill',
  props: {
    // eslint-disable-next-line vue/require-default-prop
    content: String,
    // eslint-disable-next-line vue/require-default-prop
    value: String,
    // eslint-disable-next-line vue/require-default-prop
    placeholder: String,
    disabled: Boolean,
    options: {
      type: Object,
      required: false,
      default: function () {
        return {}
      },
    },
    isBased64: {
      type: Boolean,
      required: false,
      default: function () {
        return false
      },
    },
  },
  data() {
    return {
      feedbackContent: '',
      defaultModules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ list: 'ordered' }, { list: 'bullet' }],
          [{ indent: '-1' }, { indent: '+1' }],
          [{ size: ['small', false, 'large', 'huge'] }],
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          [{ color: [] }, { background: [] }],
          [{ align: [] }],
          ['clean'],
          ['image'],
        ],
        imageDrop: true,
        imageResize: {
          displaySize: true,
        },
      },
    }
  },
  watch: {
    content: function () {
      if (this.quill) {
      }
    },
    value: function (newVal) {
      if (this.quill) {
        if (!!newVal && newVal !== this.feedbackContent) {
          this.feedbackContent = newVal
          this.quill.pasteHTML(newVal)
        } else if (!newVal) {
          this.quill.setText('')
        }
      }
    },
    disabled: function (newVal) {
      if (this.quill) {
        this.quill.enable(!newVal)
      }
    },
  },
  mounted() {
    this.initialize()
  },
  beforeDestroy() {
    this.quill = null
  },
  methods: {
    initialize() {
      if (this.$el) {
        const self = this
        self.options.theme = self.options.theme || 'snow'
        self.options.boundary = self.options.boundary || document.body
        self.options.modules = self.options.modules || self.defaultModules
        self.options.modules.toolbar =
          self.options.modules.toolbar !== undefined ? self.options.modules.toolbar : self.defaultModules.toolbar
        self.options.placeholder = this.placeholder || self.options.placeholder || 'Insert text here ...'
        self.options.readOnly = self.options.readOnly !== undefined ? self.options.readOnly : false
        self.quill = new Quill(self.$refs.editor, self.options)
        // set editor content
        if (self.value || self.content) {
          self.quill.pasteHTML(self.value || self.content)
        }

        // mark model as touched if editor lost focus
        self.quill.on('selection-change', (range) => {
          if (!range) {
            self.$emit('blur', self.quill)
          } else {
            self.$emit('focus', self.quill)
          }
        })
        // update model if text changes
        self.quill.on('text-change', () => {
          // console.log('text change', )
          let html = self.$refs.editor.children[0].innerHTML
          // var text = self.quill.getText()
          if (html === '<p><br></p>') html = ''
          self.feedbackContent = html
          self.$emit('input', html)
          self.$emit('change', html)
        })
        // disabled
        if (this.disabled) {
          this.quill.enable(false)
        }
        // emit ready
        self.$emit('ready', self.quill)
      }
    },
  },
}
</script>

<style lang="scss">
.quill-editor .ql-editor {
  min-height: 100px;
}
.quill-editor {
  .ql-toolbar.ql-snow {
    // height: 35px;
    // line-height: 25px;
    padding: 0px;
  }
  .ql-snow .ql-tooltip {
    z-index: 1000;
  }
  .ql-snow .ql-picker {
    height: initial;
  }
  .ql-toolbar.ql-snow .ql-formats {
    margin: 2px;
  }
  .ql-snow .ql-picker.ql-header {
    width: 88px;
  }
  .ql-snow .ql-picker.ql-size {
    width: 76px;
  }
  .ql-snow.ql-toolbar button,
  .ql-snow .ql-toolbar button {
    width: 24px;
  }
}
</style>
