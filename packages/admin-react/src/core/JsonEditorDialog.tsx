import { ModalForm, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import React from 'react'

interface SimpleData {
  content: string
}

interface Props {
  trigger: JSX.Element
  onSubmit: (data: {}) => Promise<void>
  title?: string
  data?: {}
}

export const JsonEditorDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<SimpleData>()
  const title = props.title || '请输入'

  const formatContent = () => {
    try {
      const content = form.getFieldValue('content')
      const data = JSON.parse(content)
      form.setFieldValue('content', JSON.stringify(data, null, 2))
      return data
    } catch (e) {
      message.error(`JSON 格式有误`)
      throw e
    }
  }
  return (
    <ModalForm<SimpleData>
      // open={true}
      title={title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      initialValues={{ content: JSON.stringify(props.data || {}, null, 2) }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async () => {
        if (props.onSubmit) {
          await props.onSubmit(formatContent())
        }
        return true
      }}
    >
      <ProFormTextArea
        name='content'
        fieldProps={{
          rows: 10,
        }}
      />
      <Button onClick={formatContent}>格式化校验</Button>
    </ModalForm>
  )
}
