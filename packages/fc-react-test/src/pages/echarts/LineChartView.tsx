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
