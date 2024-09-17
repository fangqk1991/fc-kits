import React, { useState } from 'react'
import { Radio, Select } from 'antd'
import { DialogProps, ReactDialog } from './ReactDialog'
import { SelectOption } from '@fangcha/tools'

interface Props extends DialogProps {
  options: SelectOption[]
}

export class SimplePickerDialog extends ReactDialog<Props, string> {
  title = '请选择'
  forceUsing: 'Radio' | 'Select' | '' = ''

  static dialogWithOptions(options: SelectOption[]) {
    return new SimplePickerDialog({ options: options })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [result, setResult] = useState(props.curValue)
      props.context.handleResult = () => {
        return result
      }
      const usingSelect = this.forceUsing === 'Select' || props.options.length >= 10
      if (usingSelect) {
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
      return <Radio.Group defaultValue={result} options={props.options} onChange={(e) => setResult(e.target.value)} />
    }
  }
}
