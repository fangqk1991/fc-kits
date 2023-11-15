import React, { useState } from 'react'
import { Select } from 'antd'
import { DialogProps, ReactDialog } from './ReactDialog'
import { SelectOption } from '@fangcha/tools/lib'

interface Props extends DialogProps {
  options: SelectOption[]
}

export class SimplePickerDialog extends ReactDialog<Props, string> {
  title = '请选择'

  static dialogWithOptions(options: SelectOption[]) {
    return new SimplePickerDialog({ options: options })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [result, setResult] = useState(props.curValue)
      props.context.handleResult = () => {
        return result
      }
      return (
        <Select
          defaultValue={result}
          style={{ width: '100%' }}
          onChange={(value) => {
            setResult(value)
          }}
          options={props.options}
        />
      )
    }
  }
}
