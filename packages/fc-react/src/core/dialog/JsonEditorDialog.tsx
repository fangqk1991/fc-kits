import { ProForm, ProFormTextArea } from '@ant-design/pro-components'
import { Button, Form, message } from 'antd'
import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface SimpleData {
  content: string
}

type Props = DialogProps<{}>

export class JsonEditorDialog extends ReactDialog<Props, {}> {
  title = '编辑'
  width: string | number = 1000
  // escDisabled = true

  public static dialogForEditing(data: {}, title?: string) {
    const dialog = new JsonEditorDialog({
      curValue: data,
    })
    if (title) {
      dialog.title = title
    }
    return dialog
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [form] = Form.useForm<SimpleData>()
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
      props.context.handleResult = () => {
        return formatContent()
      }
      return (
        <ProForm<SimpleData>
          form={form}
          autoFocusFirstInput
          initialValues={{ content: JSON.stringify(props.curValue || {}, null, 2) }}
          submitter={false}
        >
          <ProFormTextArea
            name='content'
            fieldProps={{
              rows: 15,
            }}
          />
          <Button onClick={formatContent}>格式化校验</Button>
        </ProForm>
      )
    }
  }
}
