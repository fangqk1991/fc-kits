import React, { useMemo } from 'react'
import styled from '@emotion/styled'

interface Props {
  value: string | {}
}

const Pre = styled.pre(`
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
  
  border: 1px solid #e0e5e8;
  padding: 0.5em;
`)

export const JsonPre: React.FC<Props> = (props) => {
  const content = useMemo(() => {
    if (!props.value) {
      return ''
    }
    if (typeof props.value === 'string') {
      let content = props.value
      try {
        content = JSON.stringify(JSON.parse(content), null, 2)
      } catch (e) {}
      return content
    }
    return JSON.stringify(props.value, null, 2)
  }, [props.value])
  return <Pre>{content}</Pre>
}
