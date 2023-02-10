import { Component, Prop } from 'vue-property-decorator'
import { ViewController } from '../src/ViewController'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent, LegendComponent, TitleComponent, ToolboxComponent, TooltipComponent } from 'echarts/components'
import { BarChart, LineChart } from 'echarts/charts'
import { EChartsOption, ToolboxComponentOption } from 'echarts'
import { RawChartClickEventParams } from './ChartTypes'
const VChart = require('vue-echarts').default

use([
  CanvasRenderer,
  GridComponent,
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  LegendComponent,
  LineChart,
  BarChart,
])

export interface LineChartLegend {
  name: string
  data: {}
  lineStyle?: {
    type: 'solid' | 'dashed' | 'dotted'
  }
}

export interface LineChartData {
  title: string
  xAxisValues: (string | number)[]
  xAxisLabelFormat?: (val: string | number) => string
  legends: LineChartLegend[]
  legendCheckedMap?: { [p: string]: boolean }
  toolbox?: ToolboxComponentOption
  onClick?: (params: ChartClickParams) => void
}

export interface ChartClickParams {
  seriesName: string
  xValue: string
  yValue: number
}

/**
 * @description https://github.com/ecomfe/vue-echarts
 */
@Component({
  components: {
    'v-chart': VChart,
  },
  template: `<v-chart :option="options" :style="{ height: height }" :autoresize="true" @click="onClick" />`,
})
export class MyLineChart extends ViewController {
  @Prop({ default: '600px', type: String }) readonly height!: string
  @Prop({ default: null, type: Object }) readonly data!: LineChartData

  seriesType: string = 'line'

  onClick(params: RawChartClickEventParams) {
    if (this.data.onClick) {
      this.data.onClick({
        seriesName: params.seriesName,
        xValue: params.name,
        yValue: params.value as number,
      })
    }
  }

  get options(): EChartsOption {
    const legends = this.data.legends
    const xAxisValues = this.data.xAxisValues
    return {
      title: {
        text: this.data.title,
        left: 'center',
      },
      tooltip: {
        trigger: 'axis',
      },
      legend: {
        // orient: 'vertical',
        // left: 'left',
        bottom: '0',
        data: legends.map((item) => item.name),
        selected: this.data.legendCheckedMap || {},
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      toolbox: this.data.toolbox || {},
      // toolbox: {
      //   feature: {
      //     saveAsImage: {},
      //   },
      // },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: xAxisValues,
        axisLabel: {
          formatter: this.data.xAxisLabelFormat,
        },
        axisPointer: {
          label: {
            formatter: this.data.xAxisLabelFormat
              ? (params) => {
                  return this.data.xAxisLabelFormat!(params.value as any)
                }
              : undefined,
          },
        },
      },
      yAxis: {
        type: 'value',
      },
      series: legends.map((item) => {
        return {
          name: item.name,
          type: this.seriesType as any,
          smooth: true,
          data: xAxisValues.map((xVal) => item.data[xVal]),
          lineStyle: {
            ...(item.lineStyle || {}),
          },
        }
      }),
    }
  }
}
