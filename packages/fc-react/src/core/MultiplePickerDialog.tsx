import React, { useState } from 'react'
import { Checkbox } from 'antd'
import { DialogProps, ReactDialog } from './ReactDialog'
import { SelectOption } from '@fangcha/tools'

interface Props extends DialogProps {
  options: SelectOption[]
  checkedList?: any[]
}

export class MultiplePickerDialog extends ReactDialog<Props, (string | number | boolean)[]> {
  title = '请选择'

  static dialogWithOptions(options: SelectOption[]) {
    return new MultiplePickerDialog({ options: options })
  }

  static dialogWithValues(values: any[]) {
    return new MultiplePickerDialog({
      options: values.map((value) => {
        return {
          label: value,
          value: value,
          checked: false,
        }
      }),
    })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [checkedList, setCheckedList] = useState(props.checkedList || [])
      props.context.handleResult = () => {
        return checkedList
      }
      return (
        <Checkbox.Group
          style={{ display: 'block' }}
          options={props.options}
          value={checkedList}
          onChange={(checkedValues) => setCheckedList(checkedValues)}
        />
      )
    }
  }
}
