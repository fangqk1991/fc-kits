import React from 'react'
import { useQueryParams } from '@fangcha/react'
import { Tabs } from 'antd'
import { EChartsLineDemoView } from './echarts/EChartsLineDemoView'

export const TestEChartsView: React.FC = () => {
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    keywords: string
    curTab: string
    [p: string]: any
  }>()

  return (
    <Tabs
      activeKey={queryParams.curTab || 'OptionBuilder'}
      onChange={(curTab) => updateQueryParams({ curTab: curTab }, false)}
      type='card'
      items={[
        {
          label: `OptionBuilder`,
          key: 'OptionBuilder',
          children: <EChartsLineDemoView />,
        },
      ]}
    />
  )
}
