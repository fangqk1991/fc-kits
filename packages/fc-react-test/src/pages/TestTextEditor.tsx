import React from 'react'
import { message } from 'antd'
import { RichTextEditor } from '@fangcha/react/rich-text'

export const TestTextEditor: React.FC = () => {
  return <RichTextEditor onChange={(value) => message.info(value)} />
}
