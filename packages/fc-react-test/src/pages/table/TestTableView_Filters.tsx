import React, { useState } from 'react'
import { message } from 'antd'
import { TableView } from '@fangcha/react'
import { PageResult, SelectOption, sleep } from '@fangcha/tools'
import { TestTableView_SomeData, TestTableView_Tools } from './TestTableView_Tools'
import { FilterDropdownView } from './FilterDropdownView'

interface Props {
  version: number
}

export const TestTableView_Filters: React.FC<Props> = ({ version }) => {
  const options: SelectOption[] = [
    {
      label: 'A',
      value: 'a',
    },
    {
      label: 'B',
      value: 'b',
    },
    {
      label: 'C',
      value: 'c',
    },
  ]
  const [checkedValues, setCheckedValues] = useState<string[]>(
    options.filter((_) => Math.random() > 0.5).map((item) => item.value as string)
  )
  return (
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
          filtered: !!checkedValues && checkedValues.length > 0,
          filterDropdown: (
            <FilterDropdownView.MultiSelector
              title={'UID'}
              options={options}
              checkedValues={checkedValues}
              onCheckedValuesChanged={(newValues) => {
                message.success(`[${newValues.join(', ')}] checked.`)
                setCheckedValues(newValues)
              }}
            />
          ),
        },
        {
          title: 'Value',
          key: 'value',
          sorter: (a: TestTableView_SomeData, b: TestTableView_SomeData) => a.value - b.value,
          render: (item: TestTableView_SomeData) => <span>{item.value}</span>,
        },
      ]}
      loadData={async (retainParams) => {
        console.info(retainParams)
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
  )
}
