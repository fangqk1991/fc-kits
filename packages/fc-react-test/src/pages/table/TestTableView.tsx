import React, { useState } from 'react'
import { Button, Divider, Space, Tabs } from 'antd'
import { useQueryParams } from '@fangcha/react'
import { TestTableView_LoadData } from './TestTableView_LoadData'
import { TestTableView_LoadOnePageItems } from './TestTableView_LoadOnePageItems'
import { TestTableView_WideTable } from './TestTableView_WideTable'
import { TestTableView_Filters } from './TestTableView_Filters'

export const TestTableView: React.FC = () => {
  const [version, setVersion] = useState(0)
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    keywords: string
    curTab: string
    [p: string]: any
  }>()

  return (
    <div>
      <Space>
        <Button type={'primary'} onClick={() => setVersion(version + 1)}>
          version + 1
        </Button>
        <Button onClick={() => setQueryParams({})}>重置过滤器</Button>
      </Space>
      <Divider />
      <Tabs
        activeKey={queryParams.curTab || 'loadData'}
        onChange={(curTab) => updateQueryParams({ curTab: curTab }, false)}
        type='card'
        items={[
          {
            label: `loadData`,
            key: 'loadData',
            children: <TestTableView_LoadData version={version} />,
          },
          {
            label: `loadOnePageItems`,
            key: 'loadOnePageItems',
            children: <TestTableView_LoadOnePageItems version={version} />,
          },
          {
            label: `Wide Table`,
            key: 'wideTable',
            children: <TestTableView_WideTable version={version} />,
          },
          {
            label: `Filters`,
            key: 'filters',
            children: <TestTableView_Filters version={version} />,
          },
        ]}
      />
    </div>
  )
}
