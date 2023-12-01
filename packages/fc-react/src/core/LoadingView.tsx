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
  setText: (text: string) => void
}

export const LoadingView: React.FC<{ text?: string; context?: LoadingViewContext; [p: string]: any }> = (props) => {
  const [text, setText] = useState(props.text || 'Loading……')
  if (props.context) {
    props.context.setText = setText
  }
  return (
    <Loading {...props}>
      <div>
        <Spin size='large' />
      </div>
      <div style={{ marginTop: '4px', color: ReactTheme.colorPrimary }}>{text}</div>
    </Loading>
  )
}
