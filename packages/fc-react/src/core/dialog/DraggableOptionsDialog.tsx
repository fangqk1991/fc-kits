import React, { useState } from 'react'
import { SelectOption } from '@fangcha/tools/lib'
import { DialogProps, ReactDialog } from './ReactDialog'
import { DraggableOptionsPanel } from '../DraggableOptionsPanel'

interface Props<T = any> extends DialogProps {
  options: (SelectOption & { entity?: T })[]
}

export class DraggableOptionsDialog<T = any> extends ReactDialog<
  Props<T>,
  (SelectOption & { entity: T; index: number })[]
> {
  title = '拖动调整顺序'

  static dialogWithOptions<T = any>(options: (SelectOption & { entity?: T })[]) {
    return new DraggableOptionsDialog({ options: options })
  }

  public rawComponent(): React.FC<Props<T>> {
    return (props) => {
      const [options, setOptions] = useState([...props.options])

      props.context.handleResult = () => {
        return options.map((option, index) => ({
          ...option,
          entity: option.entity !== undefined ? option.entity : option.value,
          index: index,
        }))
      }

      return <DraggableOptionsPanel options={options} onChange={(newOptions) => setOptions(newOptions)} />
    }
  }
}
