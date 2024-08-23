import React, { useMemo } from 'react'
import { EChartOptionBuilder } from '@fangcha/react/echarts'
import ReactECharts from 'echarts-for-react'

export const EChartsLineDemoView: React.FC = () => {
  const options = useMemo(
    () =>
      EChartOptionBuilder.buildOptions({
        timeList: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        mainSeriesOptionList: [
          {
            name: 'Email',
            data: [120, 132, 101, 134, 90, 230, 210],
          },
          {
            name: 'Union Ads',
            data: [220, 182, 191, 234, 290, 330, 310],
          },
          {
            name: 'Video Ads',
            data: [150, 232, 201, 154, 190, 330, 410],
          },
          {
            name: 'Direct',
            data: [320, 332, 301, 334, 390, 330, 320],
          },
          {
            name: 'Search Engine',
            data: [820, 932, 901, 934, 1290, 1330, 1320],
          },
        ],
        xAxisOptions: {
          boundaryGap: false,
        },
      }),
    []
  )
  return (
    <ReactECharts
      style={{ height: '700px' }}
      option={options}
      // onEvents={{
      //   click: (event: RawChartClickEventParams) => {
      //     props.onClick && props.onClick(kLines, event.dataIndex)
      //   },
      // }}
    />
  )
}
