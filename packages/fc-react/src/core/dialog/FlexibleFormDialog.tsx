import React, { useState } from 'react'
import { Form } from 'antd'
import { ProForm } from '@ant-design/pro-components'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props<T = any> extends DialogProps {
  formBody: React.ReactNode
  data?: T
  placeholder?: T
}

export class FlexibleFormDialog<T = any> extends ReactDialog<Props<T>, T> {
  title = 'Form'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [params, setParams] = useState<any>(JSON.parse(JSON.stringify(props.data || props.placeholder || {})))

      const [form] = Form.useForm()
      props.context.handleResult = () => {
        return {
          ...form.getFieldsValue(),
          ...params,
        }
      }

      return (
        <ProForm form={form} layout='vertical' style={{ marginTop: '16px' }} submitter={false} initialValues={params}>
          {props.formBody}
        </ProForm>
      )
    }
  }
}
