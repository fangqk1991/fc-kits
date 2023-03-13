import { ModalForm } from '@ant-design/pro-components'
import { Alert } from 'antd'
import React from 'react'

interface Props {
  trigger: JSX.Element
  onSubmit: () => Promise<void>
  title?: string
  content?: string
  alertType?: 'success' | 'info' | 'warning' | 'error'
}

export const ConfirmDialog: React.FC<Props> = (props) => {
  const title = props.title || '请输入'
  return (
    <ModalForm
      // open={true}
      title={title}
      trigger={props.trigger}
      autoFocusFirstInput
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit()
        }
        return true
      }}
    >
      <Alert message={props.content} type={props.alertType || 'info'} />
    </ModalForm>
  )
}
