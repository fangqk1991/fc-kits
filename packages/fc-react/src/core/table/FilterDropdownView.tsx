import React from 'react'
import { Checkbox, Select } from 'antd'
import { SelectOption } from '@fangcha/tools'

interface SelectorProps<T = any> {
  title: string
  options: SelectOption[]
  value?: T
  onValueChanged?: (newValues: T) => void | Promise<void>
}

interface MultipleSelectorProps<T = any> {
  title: string
  options: SelectOption[]
  checkedValues?: T[]
  onCheckedValuesChanged?: (newValues: T[]) => void | Promise<void>
}

export class FilterDropdownView {
  public static Selector: React.FC<SelectorProps> = ({ title, options, value, onValueChanged }) => {
    return (
      <div style={{ padding: '8px' }}>
        <h4 style={{ margin: '0 0 8px' }}>{title}</h4>
        <Select
          value={value || ''}
          style={{ minWidth: '200px' }}
          onChange={(value) => {
            onValueChanged && onValueChanged(value)
          }}
          size={'small'}
          options={[
            {
              label: 'ALL',
              value: '',
            },
            ...options,
          ]}
        />
      </div>
    )
  }

  public static MultiSelector: React.FC<MultipleSelectorProps> = ({
    title,
    options,
    checkedValues,
    onCheckedValuesChanged,
  }) => {
    return (
      <div style={{ padding: '8px' }}>
        <h4 style={{ margin: '0 0 8px' }}>{title}</h4>
        <Checkbox.Group
          options={options}
          value={checkedValues || []}
          onChange={(newValues) => {
            onCheckedValuesChanged && onCheckedValuesChanged(newValues)
          }}
        />
      </div>
    )
  }

  public static TextSearcher: React.FC<MultipleSelectorProps> = ({
    title,
    options,
    checkedValues,
    onCheckedValuesChanged,
  }) => {
    return (
      <div style={{ padding: '8px' }}>
        <h4 style={{ margin: '0 0 8px' }}>{title}</h4>
        <Checkbox.Group
          options={options}
          value={checkedValues || []}
          onChange={(newValues) => {
            onCheckedValuesChanged && onCheckedValuesChanged(newValues)
          }}
        />
      </div>
    )
  }
}
