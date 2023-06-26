import React, { useState } from 'react'
import { Button, Divider, message, Space } from 'antd'
import { TableView, TableViewColumn } from '@fangcha/react'
import { SelectOption } from '@fangcha/tools'

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
  const [textValue, setTextValue] = useState('')
  return (
    <div>
      <Space>
        <Button
          onClick={() => {
            setTextValue('')
            setSelectorValue('')
            setCheckedValues([])
          }}
        >
          Clear
        </Button>
      </Space>
      <Divider />

      <TableView
        reactiveQuery={true}
        version={version}
        tableProps={{
          size: 'small',
        }}
        columns={[
          TableViewColumn.selectorColumn({
            title: 'Selector',
            options: options,
            value: selectorValue,
            onValueChanged: (newValue) => {
              message.success(`Select "${newValue}"`)
              setSelectorValue(newValue)
            },
            render: () => {
              return `selectorValue: ${selectorValue}`
            },
          }),
          TableViewColumn.multiSelectorColumn({
            title: 'MultiSelector',
            options: options,
            checkedValues: checkedValues,
            onCheckedValuesChanged: (newValues) => {
              message.success(`[${JSON.stringify(newValues)}] checked.`)
              setCheckedValues(newValues)
            },
            render: () => {
              return `checkedValues: ${JSON.stringify(checkedValues)}`
            },
          }),
          TableViewColumn.textSearcherColumn({
            title: 'TextSearcher',
            value: textValue,
            onValueChanged: (newVal) => {
              message.success(`Search "${newVal}"`)
              setTextValue(newVal)
            },
            render: () => {
              return `textValue: ${textValue}`
            },
          }),
        ]}
        loadOnePageItems={async () => {
          return [null]
        }}
      />
    </div>
  )
}
