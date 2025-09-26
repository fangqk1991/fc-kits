import React, { useState } from 'react'
import { Table, TableProps } from 'antd'
import { TestTableView_SomeData, TestTableView_Tools } from './TestTableView_Tools'

interface Props {
  version: number
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

export const TestTableView_Picker: React.FC<Props> = ({ version }) => {
  const [items] = useState(() => TestTableView_Tools.makeDataList(30))

  const [selectedValues, setSelectedValues] = useState<React.Key[]>([])
  const rowSelection: TableRowSelection<TestTableView_SomeData> = {
    onChange: (newSelectedRowKeys: React.Key[]) => {
      console.info('setSelectedValues changed: ', newSelectedRowKeys)
      setSelectedValues(newSelectedRowKeys)
    },
  }

  return (
    <Table
      size={'small'}
      rowKey={(item: TestTableView_SomeData) => {
        return item.uid
      }}
      rowSelection={rowSelection}
      columns={[
        {
          title: 'UID',
          render: (item: TestTableView_SomeData) => <span>{item.uid}</span>,
        },
        {
          title: 'Value',
          render: (item: TestTableView_SomeData) => <span>{item.value}</span>,
        },
      ]}
      dataSource={items}
    />
  )
}
