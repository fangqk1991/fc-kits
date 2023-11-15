import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { LoadingView } from '../LoadingView'

interface Props extends DialogProps {
  message?: string
}

export class LoadingDialog extends ReactDialog<Props> {
  hideButtons = true
  title = ''
  closeIcon = (<></>)

  public static show(message?: string) {
    const dialog = new LoadingDialog({
      message: message,
    })
    dialog.show()
    console.info(dialog.context)
    return dialog
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <LoadingView text={props.message} />
    }
  }
}
