import React, { useState } from 'react'
import { Spin } from 'antd'
import styled from '@emotion/styled'
import { ReactTheme } from './ReactTheme'

const Loading = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  flexDirection: 'column',
})

export interface LoadingViewContext {
  setText: (text: React.ReactNode, hideSpin?: boolean) => void
}

export const LoadingView: React.FC<{ text?: React.ReactNode; context?: LoadingViewContext; [p: string]: any }> = (
  props
) => {
  const [text, setText] = useState<React.ReactNode>(props.text || 'Loading……')
  const [spinHidden, setSpinHidden] = useState(false)
  if (props.context) {
    props.context.setText = (text: React.ReactNode, hideSpin?: boolean) => {
      setText(text)
      setSpinHidden(!!hideSpin)
    }
  }
  return (
    <Loading {...props}>
      {!spinHidden && (
        <div>
          <Spin size='large' />
        </div>
      )}
      <div style={{ marginTop: '4px', color: ReactTheme.colorPrimary }}>{text}</div>
    </Loading>
  )
}
