import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps {
  element: React.ReactNode
}

export class ReactPreviewDialog extends ReactDialog<Props> {
  title = 'Preview'
  width = 800
  hideButtons = true

  public static preview(element: React.ReactNode) {
    new ReactPreviewDialog({
      element: element,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <>{props.element}</>
    }
  }
}
