import { Alert, Divider, Input, message, Space } from 'antd'
import React, { useState } from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps<any> {
  content: React.ReactNode
  alertType?: 'success' | 'info' | 'warning' | 'error'
  forceVerify?: boolean
}

export class ConfirmDialog extends ReactDialog<Props> {
  title = '请确认'

  public rawComponent(): React.FC<Props> {
    const randomText = `${1000 + Math.floor(Math.random() * 9000)}`

    return (props) => {
      const [verifyText, setVerifyText] = useState('')

      props.context.handleResult = () => {
        if (props.forceVerify && randomText !== verifyText) {
          message.error('验证失败，请重新输入验证信息')
          throw new Error('验证失败，请重新输入验证信息')
        }
      }

      return (
        <div>
          <Alert message={props.content} type={props.alertType || 'error'} />
          {props.forceVerify && (
            <>
              <Divider />
              <Space direction={'vertical'}>
                <div style={{ color: 'red', fontWeight: 'bold' }}>
                  * 本操作存在风险，为避免误操作，请输入验证信息: {randomText}
                </div>
                <Input
                  value={verifyText}
                  onChange={(e) => setVerifyText(e.target.value)}
                  placeholder={'请输入验证信息'}
                  onPressEnter={props.context.onClickSubmit}
                />
              </Space>
            </>
          )}
        </div>
      )
    }
  }
}
