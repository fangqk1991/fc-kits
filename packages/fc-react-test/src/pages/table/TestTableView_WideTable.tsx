import React from 'react'
import { TableView } from '@fangcha/react'
import { sleep } from '@fangcha/tools'
import { TestTableView_SomeData, TestTableView_Tools } from './TestTableView_Tools'

interface Props {
  version: number
}

export const TestTableView_WideTable: React.FC<Props> = ({ version }) => {
  return (
    <TableView
      tableProps={{
        size: 'small',
      }}
      version={version}
      rowKey={(item: TestTableView_SomeData) => {
        return item.uid
      }}
      columns={[
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
      ]}
      loadOnePageItems={async () => {
        const items = TestTableView_Tools.makeDataList()
        await sleep(1000)
        return items
      }}
    />
  )
}
