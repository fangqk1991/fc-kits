import React from 'react'
import { TableView } from '@fangcha/react'
import { PageResult, sleep } from '@fangcha/tools'
import { TestTableView_SomeData, TestTableView_Tools } from './TestTableView_Tools'

interface Props {
  version: number
}

export const TestTableView_LoadData: React.FC<Props> = ({ version }) => {
  return (
    <div>
      <TableView
        reactiveQuery={true}
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
        loadData={async (retainParams) => {
          const items = TestTableView_Tools.makeDataList()
          await sleep(1000)
          const pageResult: PageResult<TestTableView_SomeData> = {
            offset: retainParams._offset!,
            length: items.length,
            totalCount: items.length * 2,
            items: items,
          }
          return pageResult
        }}
      />

      <TableView
        reactiveQuery={true}
        namespace={'table2'}
        version={version}
        tableProps={{
          size: 'small',
        }}
        rowKey={(item: TestTableView_SomeData) => {
          return item.uid
        }}
        columns={[
          {
            title: 'Table 2 UID',
            render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
          },
        ]}
        loadData={async (retainParams) => {
          const items = TestTableView_Tools.makeDataList()
          await sleep(1000)
          const pageResult: PageResult<TestTableView_SomeData> = {
            offset: retainParams._offset!,
            length: items.length,
            totalCount: items.length * 2,
            items: items,
          }
          return pageResult
        }}
      />
    </div>
  )
}
