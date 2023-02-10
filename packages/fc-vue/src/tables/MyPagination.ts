import { Vue, Component, Model, Prop } from 'vue-property-decorator'
import '../plugins/element-ui-plugin'
import '../assets/my-pagination.css'

export interface PageInfo {
  pageNumber: number
  pageSize: number
  total: number | null
}

@Component({
  template: `
    <el-pagination
      class="my-pagination"
      :current-page.sync="value.pageNumber"
      :page-size.sync="value.pageSize"
      :page-sizes="pageSizes"
      :layout="layout"
      :total="value.total"
      background
      @size-change="onPageSizeChanged"
      @current-change="onCurrentIndexChanged"
    >
    </el-pagination>
  `,
})
export class MyPagination extends Vue {
  @Model('update:value', {
    type: Object,
    default: () => {
      return {
        pageNumber: 1,
        pageSize: 15,
        total: null,
      }
    },
  })
  readonly value!: PageInfo

  @Prop({ default: 'prev, pager, next', type: String }) readonly layout?: string
  @Prop({ default: null, type: Array }) readonly pageSizes?: number[] | null

  onPageSizeChanged() {
    this.$emit('change', this.value)
  }

  onCurrentIndexChanged() {
    this.$emit('change', this.value)
  }
}
