import React, { useMemo } from 'react'
import ReactECharts from 'echarts-for-react'
import { ToolboxComponentOption } from 'echarts'

interface LineChartLegend {
  name: string
  data: {}
  lineStyle?: {
    type: 'solid' | 'dashed' | 'dotted'
  }
}

interface LineChartProps {
  title: string
  xAxisValues: (string | number)[]
  xAxisLabelFormat?: (val: string | number) => string
  legends: LineChartLegend[]
  legendCheckedMap?: { [p: string]: boolean }
  toolbox?: ToolboxComponentOption
  height: string | number
  // onClick?: (params: ChartClickParams) => void
}

export const LineChartView: React.FC<LineChartProps> = (props) => {
  const options = useMemo(() => {
    const legends = props.legends
    const xAxisValues = props.xAxisValues
    return {
      title: {
        text: props.title,
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
        selected: props.legendCheckedMap || {},
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '8%',
        containLabel: true,
      },
      toolbox: props.toolbox || {},
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
          formatter: props.xAxisLabelFormat,
        },
        axisPointer: {
          label: {
            formatter: props.xAxisLabelFormat
              ? (params: any) => {
                  return props.xAxisLabelFormat!(params.value as any)
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
          type: 'line',
          // type: this.seriesType as any,
          smooth: true,
          data: xAxisValues.map((xVal) => item.data[xVal]),
          lineStyle: {
            ...(item.lineStyle || {}),
          },
        }
      }),
    }
  }, [])
  return (
    <ReactECharts
      style={{ height: typeof props.height === 'number' ? `${props.height}px` : props.height }}
      option={options}
      // onEvents={{
      //   click: (event: RawChartClickEventParams) => {
      //     props.onClick && props.onClick(kLines, event.dataIndex)
      //   },
      // }}
    />
  )
}

export const TestEChartsView: React.FC = () => {
  return (
    <LineChartView
      height={700}
      //     onClick: (params) => {
      //   this.$message.success(`Click "${params.seriesName}" - (${params.xValue}, ${params.yValue})`)
      // },
      toolbox={{
        feature: {
          saveAsImage: {},
        },
      }}
      title={'Some items'}
      xAxisValues={['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']}
      xAxisLabelFormat={(val) => {
        return `#${val}#`
      }}
      legendCheckedMap={{
        Email: true,
        'Search Engine': false,
      }}
      legends={[
        {
          name: 'Email',
          data: {
            Mon: 120,
            Tue: 132,
            Wed: 101,
            Thu: 134,
            Fri: 90,
            Sat: 230,
            Sun: 210,
          },
        },
        {
          name: 'Union Ads',
          data: {
            Mon: 220,
            Tue: 182,
            Wed: 191,
            Thu: 234,
            Fri: 290,
            Sat: 330,
            Sun: 310,
          },
        },
        {
          name: 'Video Ads',
          data: {
            Mon: 150,
            Tue: 232,
            Wed: 201,
            Thu: 154,
            Fri: 190,
            Sat: 330,
            Sun: 410,
          },
        },
        {
          name: 'Direct',
          data: {
            Mon: 320,
            Tue: 332,
            Wed: 301,
            Thu: 334,
            Fri: 390,
            Sat: 330,
            Sun: 320,
          },
        },
        {
          name: 'Search Engine',
          data: {
            Mon: 820,
            Tue: 932,
            Wed: 901,
            Thu: 934,
            Fri: 1290,
            Sat: 1330,
            Sun: 1320,
          },
          lineStyle: {
            type: 'dashed',
          },
        },
      ]}
    />
  )
}
