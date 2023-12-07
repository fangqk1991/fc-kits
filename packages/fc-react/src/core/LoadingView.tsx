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
  addText: (text: React.ReactNode) => void
}

export const LoadingView: React.FC<{ text?: React.ReactNode; context?: LoadingViewContext; [p: string]: any }> = (
  props
) => {
  const [nodeItems, setNodeItems] = useState<React.ReactNode[]>([props.text || 'Loading……'])
  const [spinHidden, setSpinHidden] = useState(false)
  if (props.context) {
    props.context.setText = (text: React.ReactNode, hideSpin?: boolean) => {
      setNodeItems([text])
      setSpinHidden(!!hideSpin)
    }
    props.context.addText = (text: React.ReactNode) => {
      setNodeItems([...nodeItems, text])
    }
  }
  return (
    <Loading {...props}>
      {!spinHidden && (
        <div>
          <Spin size='large' />
        </div>
      )}
      <div style={{ marginTop: '4px', color: ReactTheme.colorPrimary }}>
        {nodeItems.length > 1 ? (
          <ul
            style={{
              paddingInlineStart: '10px',
              marginBlockStart: '4px',
            }}
          >
            {nodeItems.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>
        ) : (
          nodeItems[0]
        )}
      </div>
    </Loading>
  )
}
