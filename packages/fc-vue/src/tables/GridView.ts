import { Component } from 'vue-property-decorator'
import { MyPagination } from './MyPagination'
import { MyTableView } from './MyTableView'

@Component({
  components: {
    'my-pagination': MyPagination,
  },
  template: `
    <div>
      <slot name="header" />
      <div v-loading="isLoading">
        <template v-for="item in tableItems">
          <slot :data="item" />
        </template>
      </div>
      <my-pagination v-if="!singlePage && pageInfo.total > tableItems.length" v-model="pageInfo" :layout="pageLayout" :page-sizes="pageSizes" @change="reloadData()" />
      <slot name="footer" />
    </div>
  `,
})
export class GridView<T = any> extends MyTableView<T> {}
