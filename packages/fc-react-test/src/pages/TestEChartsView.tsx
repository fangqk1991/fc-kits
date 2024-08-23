import React from 'react'
import { useQueryParams } from '@fangcha/react'
import { Tabs } from 'antd'
import { RawOptionEChartsView } from './echarts/RawOptionEChartsView'
import { OptionsBuilderEChartsView } from './echarts/OptionsBuilderEChartsView'

export const TestEChartsView: React.FC = () => {
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    keywords: string
    curTab: string
    [p: string]: any
  }>()

  return (
    <Tabs
      activeKey={queryParams.curTab || 'RawOption'}
      onChange={(curTab) => updateQueryParams({ curTab: curTab }, false)}
      type='card'
      items={[
        {
          label: `RawOption`,
          key: 'RawOption',
          children: <RawOptionEChartsView />,
        },
        {
          label: `OptionBuilder`,
          key: 'OptionBuilder',
          children: <OptionsBuilderEChartsView />,
        },
      ]}
    />
  )
}
