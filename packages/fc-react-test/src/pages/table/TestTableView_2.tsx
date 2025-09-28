import React, { useEffect, useState } from 'react'
import { TableViewV2 } from '@fangcha/react'
import { PageResult, sleep } from '@fangcha/tools'
import { TestTableView_SomeData, TestTableView_Tools } from './TestTableView_Tools'

interface Props {
  version: number
}

export const TestTableView_2: React.FC<Props> = ({ version }) => {
  const [pageResult, setPageResult] = useState<PageResult>({
    offset: 0,
    length: 40,
    totalCount: 0,
    items: [],
  })
  const [version2, setVersion2] = useState(0)

  useEffect(() => {
    console.info(`loadData`, version)
    const items = TestTableView_Tools.makeDataList(10)
    sleep(1000).then(() => {
      const pageResult: PageResult<TestTableView_SomeData> = {
        offset: 0,
        length: items.length,
        totalCount: items.length * 2,
        items: items,
      }
      setPageResult(pageResult)
    })
  }, [version, version2])
  console.info(`version2`, version2)

  return (
    <div>
      <TableViewV2
        pageResult={pageResult}
        version={version}
        tableProps={{
          size: 'small',
        }}
        rowKey={(item: TestTableView_SomeData) => {
          return item.uid
        }}
        columns={[
          {
            title: 'UID',
            render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
          },
          {
            title: 'Value',
            key: 'value',
            sorter: (a: TestTableView_SomeData, b: TestTableView_SomeData) => a.value - b.value,
            render: (item: TestTableView_SomeData) => <span>{item.value}</span>,
          },
        ]}
        onParamsChanged={(retainParams) => {
          console.info(`onParamsChanged`, version2, retainParams)
          setVersion2(version2 + 1)
        }}
      />

      <TableViewV2
        items={pageResult.items}
        version={version}
        tableProps={{
          size: 'small',
        }}
        rowKey={(item: TestTableView_SomeData) => {
          return item.uid
        }}
        columns={[
          {
            title: 'UID',
            render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
          },
          {
            title: 'Value',
            key: 'value',
            sorter: (a: TestTableView_SomeData, b: TestTableView_SomeData) => a.value - b.value,
            render: (item: TestTableView_SomeData) => <span>{item.value}</span>,
          },
        ]}
        onParamsChanged={(retainParams) => {
          console.info(`onParamsChanged`, version2, retainParams)
          setVersion2(version2 + 1)
        }}
      />
    </div>
  )
}
