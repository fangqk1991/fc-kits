import React from 'react'
import { DialogContext, DialogProps, ReactDialog } from './ReactDialog'
import { LoadingView, LoadingViewContext } from '../LoadingView'

interface Props extends DialogProps {
  message?: React.ReactNode
}

interface ExecuteProps<T> {
  handler: (context: DialogContext & LoadingViewContext) => Promise<T>
  message?: React.ReactNode
  manualDismiss?: boolean
}

export class LoadingDialog extends ReactDialog<Props> {
  hideButtons = true
  maskClosable = false
  title = ''
  closeIcon = (<></>)
  context!: DialogContext & LoadingViewContext

  public static show(message?: string) {
    const dialog = new LoadingDialog({
      message: message,
    })
    dialog.show()
    return dialog
  }

  public static async execute<T = any>(props: ExecuteProps<T>) {
    const dialog = new LoadingDialog({
      message: props.message,
    })
    dialog.context.setText = () => {}
    dialog.show()
    try {
      const result = await props.handler(dialog.context)
      if (!props.manualDismiss) {
        dialog.dismiss()
      }
      return result
    } catch (e) {
      dialog.dismiss()
      throw e
    }
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <LoadingView text={props.message} context={this.context} />
    }
  }
}
