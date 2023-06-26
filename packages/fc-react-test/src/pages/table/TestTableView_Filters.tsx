import React, { useState } from 'react'
import { message } from 'antd'
import { FilterDropdownView, TableView } from '@fangcha/react'
import { SelectOption } from '@fangcha/tools'
import { TestTableView_SomeData } from './TestTableView_Tools'

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
  const [selectorValue, setSelectorValue] = useState('')
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
          title: 'Selector',
          filtered: !!checkedValues && checkedValues.length > 0,
          filterDropdown: (
            <FilterDropdownView.Selector
              title={'Selector'}
              options={options}
              value={selectorValue}
              onValueChanged={(newValue) => {
                message.success(`Select "${newValue}"`)
                setSelectorValue(newValue)
              }}
            />
          ),
        },
        {
          title: 'MultiSelector',
          filtered: !!checkedValues && checkedValues.length > 0,
          filterDropdown: (
            <FilterDropdownView.MultiSelector
              title={'MultiSelector'}
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
          title: 'TextSearcher',
          filterDropdown: (
            <FilterDropdownView.TextSearcher
              title={'TextSearcher'}
              options={options}
              checkedValues={checkedValues}
              onCheckedValuesChanged={(newValues) => {
                message.success(`[${newValues.join(', ')}] checked.`)
                setCheckedValues(newValues)
              }}
            />
          ),
        },
      ]}
      loadOnePageItems={async () => {
        return []
      }}
    />
  )
}
