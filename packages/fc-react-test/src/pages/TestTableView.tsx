import React, { useState } from 'react'
import { Button, Divider, Tabs } from 'antd'
import { TableView } from '@fangcha/react'
import { makeUUID, PageResult, sleep } from '@fangcha/tools'

interface SomeData {
  uid: string
  value: number
}

const makeDataList = () => {
  return new Array(10).fill(null).map(() => {
    const data: SomeData = {
      uid: makeUUID(),
      value: Math.random(),
    }
    return data
  })
}

export const TestTableView: React.FC = () => {
  const [version, setVersion] = useState(0)

  return (
    <div>
      <Button type={'primary'} onClick={() => setVersion(version + 1)}>
        Refresh
      </Button>
      <Divider />
      <Tabs
        defaultActiveKey={'loadData'}
        type='card'
        items={[
          {
            label: `loadData`,
            key: 'loadData',
            children: (
              <div>
                <TableView
                  reactiveQuery={true}
                  version={version}
                  tableProps={{
                    size: 'small',
                  }}
                  rowKey={(item: SomeData) => {
                    return item.uid
                  }}
                  columns={[
                    {
                      title: 'Table 1 UID',
                      render: (item: SomeData) => <span>{item.uid}</span>,
                    },
                    {
                      title: 'Value',
                      key: 'value',
                      sorter: (a: SomeData, b: SomeData) => a.value - b.value,
                      render: (item: SomeData) => <span>{item.value}</span>,
                    },
                  ]}
                  loadData={async (retainParams) => {
                    const items = makeDataList()
                    await sleep(1000)
                    const pageResult: PageResult<SomeData> = {
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
                  rowKey={(item: SomeData) => {
                    return item.uid
                  }}
                  columns={[
                    {
                      title: 'Table 2 UID',
                      render: (item: SomeData) => <span>{item.uid}</span>,
                    },
                  ]}
                  loadData={async (retainParams) => {
                    const items = makeDataList()
                    await sleep(1000)
                    const pageResult: PageResult<SomeData> = {
                      offset: retainParams._offset!,
                      length: items.length,
                      totalCount: items.length * 2,
                      items: items,
                    }
                    return pageResult
                  }}
                />
              </div>
            ),
          },
          {
            label: `loadOnePageItems`,
            key: 'loadOnePageItems',
            children: (
              <TableView
                version={version}
                rowKey={(item: SomeData) => {
                  return item.uid
                }}
                columns={[
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                ]}
                loadOnePageItems={async () => {
                  const items = makeDataList()
                  await sleep(1000)
                  return items
                }}
              />
            ),
          },
          {
            label: `Wide Table`,
            key: 'wideTable',
            children: (
              <TableView
                tableProps={{
                  size: 'small',
                }}
                version={version}
                rowKey={(item: SomeData) => {
                  return item.uid
                }}
                columns={[
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                  {
                    title: 'UID',
                    render: (item: SomeData) => <span>{item.uid}</span>,
                  },
                ]}
                loadOnePageItems={async () => {
                  const items = makeDataList()
                  await sleep(1000)
                  return items
                }}
              />
            ),
          },
        ]}
      />
    </div>
  )
}
