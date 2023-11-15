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
    return dialog
  }

  public static async execute<T = any>(handler: () => Promise<T>, message?: string) {
    const dialog = new LoadingDialog({
      message: message,
    })
    dialog.show()
    try {
      const result = await handler()
      dialog.dismiss()
      return result
    } catch (e) {
      dialog.dismiss()
      throw e
    }
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <LoadingView text={props.message} />
    }
  }
}
