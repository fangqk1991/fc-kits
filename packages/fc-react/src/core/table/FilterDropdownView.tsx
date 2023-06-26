import React from 'react'
import { Checkbox } from 'antd'
import { SelectOption } from '@fangcha/tools'

interface MultipleSelectorProps<T = any> {
  title: string
  options: SelectOption[]
  checkedValues: T[]
  onCheckedValuesChanged?: (newValues: T[]) => void | Promise<void>
}

export class FilterDropdownView {
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
          value={checkedValues}
          onChange={(newValues) => {
            onCheckedValuesChanged && onCheckedValuesChanged(newValues)
          }}
        />
      </div>
    )
  }
}
