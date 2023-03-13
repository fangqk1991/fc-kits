import { ModalForm, ProFormText, ProFormTextArea } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'

interface SimpleData {
  content: string
}

interface Props {
  trigger: JSX.Element
  onSubmit: (text: string) => Promise<void>
  title?: string
  description?: string
  content?: string
  type?: 'text' | 'textarea' | 'password'
}

export const SimpleInputDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<SimpleData>()
  const title = props.title || '请输入'
  const type = props.type || 'text'
  return (
    <ModalForm<SimpleData>
      // open={true}
      title={title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      initialValues={{ content: props.content }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(data.content)
        }
        return true
      }}
    >
      {type === 'text' && <ProFormText name='content' label={title} />}
      {type === 'textarea' && (
        <ProFormTextArea
          name='content'
          label={title}
          fieldProps={{
            rows: 10,
          }}
        />
      )}
      {type === 'password' && <ProFormText.Password name='content' label='Password' />}
      {props.description && <p>{props.description}</p>}
    </ModalForm>
  )
}
