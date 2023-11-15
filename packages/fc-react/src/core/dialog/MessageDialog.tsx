import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps {
  element: React.ReactNode
}

export class MessageDialog extends ReactDialog<Props> {
  title = 'Alert'
  // width = 800
  hideButtons = true

  public static alert(element: React.ReactNode) {
    new MessageDialog({
      element: element,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <>{props.element}</>
    }
  }
}
