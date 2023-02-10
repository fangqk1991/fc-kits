import { Component } from 'vue-property-decorator'
import { MyLineChart } from './MyLineChart'

/**
 * @description https://github.com/ecomfe/vue-echarts
 */
@Component({
  mixins: [MyLineChart],
})
export class MyBarChart extends MyLineChart {
  seriesType = 'bar'
}
