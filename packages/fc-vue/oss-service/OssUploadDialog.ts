import './upload.dialog.scss'
import { Component, CustomDialog, CustomDialogView, i18n } from '../src'
import axios from 'axios'
import { MetadataBuildProtocol, OSSResourceModel, OssTypicalParams } from '@fangcha/oss-service/lib/common/models'
import { FrontendFile } from '@fangcha/tools/lib/file-frontend'
import { OssHTTP } from './OssHTTP'
import { OssFrontendService } from './OssFrontendService'

@Component({
  components: {
    'custom-dialog-view': CustomDialogView,
  },
  template: `
    <custom-dialog-view ref="my-dialog" :title="title" :close-on-click-modal="false">
      <el-form class="mb-2">
        <el-form-item>
          <el-input v-model="fileInfo" class="file-input" :disabled="true" style="width: 100%;">
            <template slot="append">
              <input ref="btn-select" type="file" :accept="inputAccepts" style="display: none;" @change="onFileSelect" />
              <el-button size="mini" @click="$refs['btn-select'].click()">{{ LS('Select') }}</el-button>
            </template>
          </el-input>
        </el-form-item>
        <el-form-item>
          <el-progress :text-inside="true" :stroke-width="26" :percentage="percentage" />
        </el-form-item>
      </el-form>
      <template slot="footer">
        <el-button size="small" @click="dismiss">{{ LS('Cancel') }}</el-button>
        <el-button
          v-loading="isLoading"
          size="small"
          type="primary"
          :disabled="isLoading || !canSubmit"
          @click="onSubmit"
        >
          {{ confirmBtnText }}
        </el-button>
      </template>
    </custom-dialog-view>
  `,
})
export class OssUploadDialog extends CustomDialog<OSSResourceModel> {
  title: string = i18n.t('Upload File') as string
  confirmBtnText: string = i18n.t('Confirm') as string
  percentage = 0
  curFile: File | null = null
  fileInfo = ''
  inputAccepts = '*/*'
  metadataDelegate?: MetadataBuildProtocol

  bucketName = ''
  ossZone = ''

  constructor() {
    super()
  }

  viewDidAppear() {
    ;(this.$refs['btn-select'] as any).click()
  }

  get canSubmit() {
    return !!this.curFile
  }

  onFileSelect(e: any) {
    const target = e.target
    const file = target && target.files && target.files[0]
    if (!file) {
      return
    }
    this.curFile = file
    this.fileInfo = `${file.name} - ${(file.size / 1024 / 1024).toFixed(2)}M`
  }

  private async requestMetadata() {
    const fileHash = await FrontendFile.computeFileHash(this.curFile!)
    const fileExt = FrontendFile.computeFileExt(this.curFile!)
    const mimeType = FrontendFile.computeFileMimeType(this.curFile!)
    const params: OssTypicalParams = {
      fileHash: fileHash,
      mimeType: mimeType,
      fileExt: fileExt,
      fileSize: this.curFile!.size,
      bucketName: this.bucketName || OssFrontendService.options.defaultBucketName,
      ossZone: this.ossZone || OssFrontendService.options.defaultOssZone,
    }
    const metadataDelegate: MetadataBuildProtocol = this.metadataDelegate || OssHTTP.getOssResourceMetadata
    return await metadataDelegate(params)
  }

  async onSubmit() {
    if (!this.curFile) {
      return
    }

    this.percentage = 0
    const resourceMetadata = await this.requestMetadata()
    const formData = new FormData()
    const params = resourceMetadata.ossMetadata.params
    Object.keys(params).forEach((key) => {
      formData.append(key, params[key])
    })
    formData.append('file', this.curFile)
    this.isLoading = true
    await axios.create().post(resourceMetadata.ossMetadata.url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent: any) => {
        this.percentage = Number((progressEvent.loaded / progressEvent.total) * 100)
      },
    })

    const resource = await OssHTTP.markOssResourceSuccess(resourceMetadata.resourceId)
    this.isLoading = false

    if (this.callback) {
      await this.callback(resource)
    }
    this.dismiss()
  }
}
