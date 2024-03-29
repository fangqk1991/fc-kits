import React, { useState } from 'react'
import { Button, Divider, message, Space, Tag } from 'antd'
import { ColumnFilterType, TableView, TableViewColumn } from '@fangcha/react'
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
  const [multiStrValue, setMultiStrValue] = useState('')
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
        hidePagination={true}
        tableProps={{
          size: 'small',
        }}
        columns={[
          {
            title: 'Normal - 1',
            render: (item, record, index) => {
              console.info(item, record, index)
              return `Normal Cell - 1`
            },
          },
          TableViewColumn.normalColumn({
            title: 'Normal - 2',
            render: (item) => {
              return `Normal Cell - 2`
            },
          }),
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
          TableViewColumn.strMultiSelectorColumn({
            title: 'StrMultiSelector',
            options: options,
            value: multiStrValue,
            onValueChanged: (newValue) => {
              message.success(`Select "${newValue}"`)
              setMultiStrValue(newValue)
            },
            render: () => {
              return `multiStrValue: ${multiStrValue}`
            },
          }),
          TableViewColumn.strMultiSelectorColumn({
            title: 'Many Options',
            options: new Array(20).fill(null).map(() => ({
              label: `${Math.random()}`,
              value: `${Math.random()}`,
            })),
            render: () => {
              return 'Nothing'
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
          return [{ a: 1 }]
        }}
      />

      <Divider />

      <TableView
        reactiveQuery={true}
        version={version}
        hidePagination={true}
        tableProps={{
          size: 'small',
        }}
        columns={TableViewColumn.makeColumns<null>([
          {
            title: 'Normal',
            render: (item) => {
              return `Normal Cell`
            },
          },
          {
            filterType: ColumnFilterType.Selector,
            title: 'Selector',
            options: options,
            value: selectorValue,
            onValueChanged: (newValue) => {
              message.success(`Select "${newValue}"`)
              setSelectorValue(newValue)
            },
            render: (item) => {
              return `selectorValue: ${selectorValue}`
            },
          },
          {
            filterType: ColumnFilterType.MultiSelector,
            title: 'MultiSelector',
            options: options,
            checkedValues: checkedValues,
            onCheckedValuesChanged: (newValues) => {
              message.success(`[${JSON.stringify(newValues)}] checked.`)
              setCheckedValues(newValues)
            },
            render: (item) => {
              return `checkedValues: ${JSON.stringify(checkedValues)}`
            },
          },
          {
            filterType: ColumnFilterType.StrMultiSelector,
            title: 'StrMultiSelector',
            options: options,
            value: multiStrValue,
            onValueChanged: (newValue) => {
              message.success(`Select "${newValue}"`)
              setMultiStrValue(newValue)
            },
            render: (item) => {
              return `multiStrValue: ${multiStrValue}`
            },
          },
          {
            filterType: ColumnFilterType.TextSearcher,
            title: <Tag color={'geekblue'}>TextSearcher</Tag>,
            value: textValue,
            onValueChanged: (newVal) => {
              message.success(`Search "${newVal}"`)
              setTextValue(newVal)
            },
            render: (item) => {
              return `textValue: ${textValue}`
            },
          },
        ])}
        loadOnePageItems={async () => {
          return [null]
        }}
      />
    </div>
  )
}
