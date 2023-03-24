import React from 'react'
import { Spin } from 'antd'
import styled from '@emotion/styled'

const Loading = styled.div({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
})

export const LoadingView: React.FC<{ text?: string; [p: string]: any }> = (props) => {
  return (
    <Loading {...props}>
      <Spin size='large' tip={props.text || 'Loading……'} />
    </Loading>
  )
}
