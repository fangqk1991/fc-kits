import React from 'react'
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

export const LoadingView: React.FC<{ text?: string; [p: string]: any }> = (props) => {
  return (
    <Loading {...props}>
      <div>
        <Spin size='large' />
      </div>
      <div style={{ marginTop: '4px', color: ReactTheme.colorPrimary }}>{props.text || 'Loading……'}</div>
    </Loading>
  )
}
