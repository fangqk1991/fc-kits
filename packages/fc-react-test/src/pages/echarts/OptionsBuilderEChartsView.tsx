import React from 'react'
import { EChartOptionBuilder } from './EChartOptionBuilder'
import { LineChartView } from './LineChartView'

export const OptionsBuilderEChartsView: React.FC = () => {
  const builder = new EChartOptionBuilder([])
  // builder.mainGrid.addYAxisAndSeries(
  //   {}
  //   // .filter((item) => !!item.strategyName)
  //   // .map((item): EchartsSeriesOption => {
  //   //   return {
  //   //     name: `【${item.strategyName}】净值`,
  //   //     type: 'line',
  //   //     data: item.equityItems!.map((equity) => equity.close.toFixed(3)),
  //   //     showSymbol: false,
  //   //     smooth: true,
  //   //   }
  //   // })
  // )
  const options = builder.build()

  return (
    <LineChartView
      height={700}
      //     onClick: (params) => {
      //   this.$message.success(`Click "${params.seriesName}" - (${params.xValue}, ${params.yValue})`)
      // },
      toolbox={{
        feature: {
          // saveAsImage: {},
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
