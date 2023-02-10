import { Component, Prop } from 'vue-property-decorator'
import '../plugins/element-ui-plugin'
import { ViewController } from '../ViewController'
import { SelectOption } from '@fangcha/tools'

@Component({
  template: `
    <div>
      <el-tag
        class="adaptive-tag"
        v-for="(option, $index) in options"
        :key="$index"
        :size="size"
        :type="type"
        style="margin-right: 4px;"
      >
        {{ option.label }}
      </el-tag>
    </div>
  `,
})
export class MyTagsPanel extends ViewController {
  @Prop({ default: 'mini', type: String }) readonly size!: string
  @Prop({ default: '', type: String }) readonly type!: string
  @Prop({ default: () => [], type: Array }) readonly values!: (string | number | any)[]
  @Prop({ default: null, type: Function }) readonly describeFunc?: (value: string | number | any) => string

  get options(): SelectOption[] {
    return this.values.map((item) => {
      return {
        label: this.describeFunc ? this.describeFunc(item) : `${item}`,
        value: item,
      }
    })
  }
}
