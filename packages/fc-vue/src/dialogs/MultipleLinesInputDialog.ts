import { Component } from 'vue-property-decorator'
import { TypicalDialogView } from './TypicalDialogView'
import { TypicalDialog } from './TypicalDialog'
import { i18n } from '../i18n'

interface InputParams {
  key: string
  label: string
  value?: string | number
  type?: 'text' | 'number' | 'textarea'
  placeholder?: string
}

@Component({
  components: {
    'typical-dialog-view': TypicalDialogView,
  },
  template: `
    <typical-dialog-view ref="my-dialog" :title="title" :callback="callback">
      <el-form size="mini" @submit.native.prevent="onConfirm">
        <el-form-item v-for="params of paramsList" :key="params.key" class="mb-2">
          <el-input v-model="params.value" :placeholder="params.placeholder" :type="params.type">
            <template slot="prepend">
              {{ params.label }}
            </template>
          </el-input>
        </el-form-item>
      </el-form>
      <p v-if="description">{{ description }}</p>
    </typical-dialog-view>
  `,
})
export class MultipleLinesInputDialog extends TypicalDialog {
  title: string = i18n.t('Please Input') as string
  paramsList: InputParams[] = []
  description = ''

  constructor() {
    super()
  }

  static dialog(paramsList: InputParams[]) {
    paramsList.forEach((params) => {
      params.type = params.type || 'text'
      params.placeholder = params.placeholder || ''
      if (params.value === undefined) {
        params.value = ''
      }
    })
    const dialog = new MultipleLinesInputDialog()
    dialog.paramsList = paramsList
    return dialog
  }

  onHandleResult() {
    return this.paramsList.reduce((result, cur) => {
      result[cur.key] = cur.value
      return result
    }, {})
  }
}
