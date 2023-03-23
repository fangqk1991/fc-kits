import { Alert } from 'antd'
import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps<any> {
  content: string
  alertType?: 'success' | 'info' | 'warning' | 'error'
}

export class ConfirmDialog extends ReactDialog<Props> {
  title = '请确认'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      return <Alert message={props.content} type={props.alertType || 'error'} />
    }
  }
}
