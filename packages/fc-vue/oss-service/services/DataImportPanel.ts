import { Component, Prop, ViewController } from '../../src'
import { OssUploadDialog } from '../OssUploadDialog'
import { OssFrontendService } from '../OssFrontendService'

export interface DataImportProtocol<T> {
  sampleFileURL: string
  onResourceUploaded: (resourceId: string) => Promise<T[]>
  submitData: (todoItem: T) => Promise<void>
  onAllTasksSubmitted: (pickedItems: T[]) => void | Promise<void>
  checkItemSuccess?: (todoItem: T) => boolean
  checkItemFail?: (todoItem: T) => boolean
  checkCellValid?: (todoItem: T, prop: string) => boolean
}

@Component({
  template: `
    <div class="mt-2 mb-2">
      <h4 v-if="title" class="mb-3">{{ title }}</h4>
      <div class="mb-3">
        <slot name="prepend"></slot>
        <el-button type="warning" size="mini" @click="onSelectFile">{{ LS('Select File') }}</el-button>
        <el-button v-if="importAble" type="success" size="mini" @click="onSubmitPendingItems">
          {{ LS('Confirm To Submit') }}
        </el-button>
        <el-button v-if="importAble" type="info" size="mini" @click="onClear">{{ LS('Clear') }}</el-button>
        <el-link class="ml-2" type="primary" @click="downloadTemplate">
          {{ LS('Download Sample') }}
          <slot name="sample-tooltip" />
        </el-link>
      </div>
      <el-table v-if="importAble" :data="pickedItems" border size="small" :row-class-name="tableRowClassName" :cell-style="cellStyle">
        <el-table-column label="Index" type="index" align="center" show-overflow-tooltip width="80px" />
        <slot />
        <el-table-column label="Action" width="90px">
          <template slot-scope="scope">
            <a
              v-if="!scope.row.succ && !scope.row.failed"
              href="javascript:"
              @click="pickedItems.splice(scope.$index, 1)"
            >
              {{ LS('Remove') }} <span class="el-icon-delete-solid" />
            </a>
            <span v-if="scope.row.failed" style="color: #F56C6C">{{ failText || LS('Update Failed') }}
              <el-tooltip v-if="scope.row.errorMessage" class="item" effect="dark" placement="top">
                <span class="question_icon el-icon-question" />
                <div slot="content">
                  {{ scope.row.errorMessage }}
                </div>
              </el-tooltip>
              <i v-else class="el-icon-error"/>
            </span>
            <span v-if="scope.row.succ" style="color: #67C23A">
              {{ successText || LS('Updated') }}
              <i class="el-icon-success"/></span>
          </template>
        </el-table-column>
      </el-table>
    </div>
  `,
})
export class DataImportPanel<T> extends ViewController {
  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '', type: String }) readonly successText!: string
  @Prop({ default: '', type: String }) readonly failText!: string
  @Prop({ default: null, type: Object }) readonly delegate!: DataImportProtocol<T>

  viewDidLoad() {}

  pickedItems: T[] = []

  get importAble() {
    return this.pickedItems.length > 0
  }

  downloadTemplate() {
    window.location.href = this.delegate.sampleFileURL
  }

  onClear() {
    this.pickedItems = []
  }

  tableRowClassName({ row }: any) {
    if ((this.delegate.checkItemSuccess && this.delegate.checkItemSuccess(row)) || row['succ']) {
      return 'row-success'
    } else if ((this.delegate.checkItemFail && this.delegate.checkItemFail(row)) || row['failed']) {
      return 'row-danger'
    }
    return ''
  }

  cellStyle({ row, column }: any) {
    if (this.delegate.checkCellValid && !this.delegate.checkCellValid(row, column.property)) {
      return {
        color: '#F56C6C',
        'font-weight': 'bold',
      }
    }
  }

  onSelectFile() {
    const dialog = new OssUploadDialog()
    dialog.bucketName = OssFrontendService.options.defaultBucketName
    dialog.title = this.LS('Select File') as string
    dialog.confirmBtnText = this.LS('Parse') as string
    dialog.show(async (resource) => {
      this.pickedItems = await this.delegate.onResourceUploaded(resource.resourceId)
      this.$message.success('确认后点击「提交」按钮，即可提交相关记录')
    })
  }

  async onSubmitPendingItems() {
    for (let i = 0; i < this.pickedItems.length; ++i) {
      const todoItem = this.pickedItems[i]
      if (todoItem['succ']) {
        continue
      }

      if (Object.keys(todoItem['invalidMap'] || {}).length > 0) {
        this.pickedItems[i]['failed'] = 1
        continue
      }

      try {
        await this.delegate.submitData(todoItem)
        this.pickedItems[i]['succ'] = 1
        this.$set(this.pickedItems, i, this.pickedItems[i])
      } catch (e) {
        this.pickedItems[i]['failed'] = 1
        this.pickedItems[i]['errorMessage'] = (e as any).response?.data
        this.$set(this.pickedItems, i, this.pickedItems[i])
      }
    }

    this.delegate.onAllTasksSubmitted(this.pickedItems)
  }
}
