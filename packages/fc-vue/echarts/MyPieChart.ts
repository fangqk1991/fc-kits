import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../src/ViewController'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { LegendComponent, TitleComponent, TooltipComponent } from 'echarts/components'
import { EChartsOption } from 'echarts'
import { RawChartClickEventParams } from './ChartTypes'
const VChart = require('vue-echarts').default

use([CanvasRenderer, PieChart, TitleComponent, TooltipComponent, LegendComponent])

export interface PieDataItem {
  name: string
  value: number
}

export interface PieChartData {
  title: string
  items: PieDataItem[]
  onClick?: (dataItem: PieDataItem) => void
  labelFormat?: (val: string) => string
}

export interface PieTooltipFormatterParams {
  data: PieDataItem
  name: string
  value: number
  percent: number
}

/**
 * @description https://github.com/ecomfe/vue-echarts
 */
@Component({
  components: {
    'v-chart': VChart,
  },
  template: `<v-chart :option="options"  :style="{ height: height }" :autoresize="true" @click="onClick" />`,
})
export class MyPieChart extends ViewController {
  @Prop({ default: '600px', type: String }) readonly height!: string
  @Prop({ default: null, type: Object }) readonly data!: PieChartData

  onClick(params: RawChartClickEventParams) {
    if (this.data.onClick) {
      this.data.onClick(params.data as PieDataItem)
    }
  }

  get options(): EChartsOption {
    return {
      title: {
        text: this.data.title,
        left: 'center',
      },
      tooltip: {
        trigger: 'item',
        formatter: (rawParams: any) => {
          const params = rawParams as PieTooltipFormatterParams
          const name = this.data.labelFormat ? this.data.labelFormat(params.name) : params.name
          return `${name}<br /><br />Value: <b>${params.value}</b><br />Proportion: <b>${params.percent}%</b>`
        },
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.data.items.map((item) => item.name),
        formatter: this.data.labelFormat
          ? (val) => {
              return this.data.labelFormat!(val)
            }
          : undefined,
      },
      series: [
        {
          label: {
            formatter: this.data.labelFormat
              ? (val) => {
                  const data = val.data as PieDataItem
                  return this.data.labelFormat!(data.name)
                }
              : undefined,
          },
          name: this.data.title,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.data.items,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)',
            },
          },
        },
      ],
    }
  }
}
