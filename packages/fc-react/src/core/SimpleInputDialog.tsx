import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { Form } from 'antd'
import { ProForm, ProFormDigit, ProFormText, ProFormTextArea } from '@ant-design/pro-components'

interface SimpleData {
  content: string
}

interface Props extends DialogProps<string> {
  type?: 'number' | 'text' | 'textarea' | 'password'
  placeholder?: string
  description?: string
}

export class SimpleInputDialog extends ReactDialog<Props, string> {
  title = '请输入'

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [form] = Form.useForm<SimpleData>()

      const type = props.type || 'text'

      props.context.handleResult = () => {
        return form.getFieldValue('content')
      }

      return (
        <ProForm form={form} autoFocusFirstInput initialValues={{ content: props.curValue }} submitter={false}>
          {(() => {
            switch (type) {
              case 'number':
                return <ProFormDigit name='content' placeholder={props.placeholder} />
              case 'text':
                return <ProFormText name='content' placeholder={props.placeholder} />
              case 'textarea':
                return (
                  <ProFormTextArea
                    name='content'
                    fieldProps={{
                      rows: 10,
                    }}
                    placeholder={props.placeholder}
                  />
                )
              case 'password':
                return <ProFormText.Password name='content' label='Password' placeholder={props.placeholder} />
            }
          })()}
          {props.description && <div>{props.description}</div>}
        </ProForm>
      )
    }
  }
}
