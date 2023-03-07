import { ModalForm, ProFormRadio } from '@ant-design/pro-components'
import { Form } from 'antd'
import React from 'react'
import { SelectOption } from '@fangcha/tools'

interface SimpleData {
  result: string
}

interface Props {
  trigger: JSX.Element
  options: SelectOption[]
  onSubmit: (value: string | number) => Promise<void>
  curValue?: string | number
  title?: string
}

export const SimplePickerDialog: React.FC<Props> = (props) => {
  const [form] = Form.useForm<SimpleData>()
  const title = props.title || '请输入'
  return (
    <ModalForm<SimpleData>
      // open={true}
      title={title}
      trigger={props.trigger}
      form={form}
      autoFocusFirstInput
      initialValues={{ result: props.curValue }}
      modalProps={{
        destroyOnClose: true,
        maskClosable: false,
        forceRender: true,
      }}
      onFinish={async (data) => {
        if (props.onSubmit) {
          await props.onSubmit(data.result)
        }
        return true
      }}
    >
      <ProFormRadio.Group name='result' options={props.options} radioType='button' />
    </ModalForm>
  )
}
