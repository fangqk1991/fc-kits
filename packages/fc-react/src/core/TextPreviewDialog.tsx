import { ModalForm } from '@ant-design/pro-components'
import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'

interface Props {
  trigger: JSX.Element
  title?: string
  content?: string
  loadData?: () => Promise<{}>
  json?: {}
}

const Pre = styled.pre(`
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
`)

export const TextPreviewDialog: React.FC<Props> = (props) => {
  const title = props.title || 'Preview'
  const [content, setContent] = useState(() => (props.json ? JSON.stringify(props.json, null, 2) : props.content) || '')
  useEffect(() => {
    if (props.loadData) {
      props.loadData().then((data) => {
        setContent(JSON.stringify(data, null, 2))
      })
    }
  }, [])
  return (
    <ModalForm
      // open={true}
      title={title}
      trigger={props.trigger}
      modalProps={{
        destroyOnClose: true,
        forceRender: true,
      }}
      submitter={{ render: () => null }}
    >
      <Pre>{content}</Pre>
    </ModalForm>
  )
}
