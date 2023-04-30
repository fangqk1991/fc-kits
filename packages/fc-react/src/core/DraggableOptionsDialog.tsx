import React, { useState } from 'react'
import { SelectOption } from '@fangcha/tools'
import { DialogProps, ReactDialog } from './ReactDialog'
import { DraggableOptionsPanel } from './DraggableOptionsPanel'

interface Props extends DialogProps {
  options: SelectOption[]
}

export class DraggableOptionsDialog extends ReactDialog<Props, SelectOption[]> {
  title = '拖动调整顺序'

  static dialogWithOptions(options: SelectOption[]) {
    return new DraggableOptionsDialog({ options: options })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [options, setOptions] = useState([...props.options])

      props.context.handleResult = () => {
        return options
      }

      return <DraggableOptionsPanel options={options} onChange={(newOptions) => setOptions(newOptions)} />
    }
  }
}
