import { MetadataBuildProtocol, OSSResourceModel } from '@fangcha/oss-service/lib/common/models'
import { ViewController } from '../src/ViewController'
import { Component, Prop } from 'vue-property-decorator'
import { OssUploadDialog } from './OssUploadDialog'

export interface PhotoFormItemProtocol {
  buildMetadata: MetadataBuildProtocol
  onUploadSuccess: (resource: OSSResourceModel) => Promise<void>
}

@Component({
  template: `
    <el-form-item :prop="propKey">
      <div>
        <span>{{ title }}</span>
        <template v-if="!disabled">
          |
          <a href="javascript:" @click="uploadPhoto">{{ LS('Upload') }}</a>
        </template>
      </div>
      <div v-if="thumbUrl">
        <el-image style="border: 1px dashed #c0ccda; border-radius: 6px; width: 250px;" fit="contain" :src="thumbUrl" :preview-src-list="[photoUrl]" />
      </div>
    </el-form-item>
  `,
})
export class ImageFormItem extends ViewController {
  @Prop({ default: null, type: Object }) readonly protocol!: PhotoFormItemProtocol

  @Prop({ default: '', type: String }) readonly title!: string
  @Prop({ default: '', type: String }) readonly thumbUrl!: string
  @Prop({ default: '', type: String }) readonly photoUrl!: string
  @Prop({ default: '', type: String }) readonly propKey!: string
  @Prop({ default: false, type: Boolean }) readonly disabled!: boolean

  uploadPhoto() {
    if (!this.protocol) {
      return
    }
    const dialog = new OssUploadDialog()
    dialog.inputAccepts = '.jpg,.png,.bmp,.gif,image/*'
    dialog.metadataDelegate = this.protocol.buildMetadata
    dialog.show(async (resource: OSSResourceModel) => {
      await this.protocol.onUploadSuccess(resource)
    })
  }
}
