import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { LoadingView, LoadingViewContext } from '../LoadingView'

interface Props extends DialogProps {
  message?: string
}

export class LoadingDialog extends ReactDialog<Props> {
  hideButtons = true
  maskClosable = false
  title = ''
  closeIcon = (<></>)
  loadingContext!: LoadingViewContext

  public static show(message?: string) {
    const dialog = new LoadingDialog({
      message: message,
    })
    dialog.show()
    return dialog
  }

  public static async execute<T = any>(handler: (context: LoadingViewContext) => Promise<T>, message?: string) {
    const dialog = new LoadingDialog({
      message: message,
    })
    dialog.loadingContext = {
      setText: () => {},
    }
    dialog.show()
    try {
      const result = await handler(dialog.loadingContext)
      dialog.dismiss()
      return result
    } catch (e) {
      dialog.dismiss()
      throw e
    }
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <LoadingView text={props.message} context={this.loadingContext} />
    }
  }
}
