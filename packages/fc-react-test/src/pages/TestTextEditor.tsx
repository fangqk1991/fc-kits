import React from 'react'
import { message } from 'antd'
import { RichTextEditor } from '@fangcha/react/rich-text'

export const TestTextEditor: React.FC = () => {
  const content = `<p><span style="background-color: rgb(230, 0, 0);">1</span></p>
<p><span style="background-color: rgb(230, 0, 0);">2</span></p><p><span style="background-color: rgb(230, 0, 0);">3</span></p><p><span style="background-color: rgb(230, 0, 0);">4</span></p><p><span style="background-color: rgb(230, 0, 0);">5</span></p>`
  return <RichTextEditor value={content} onChange={(value) => message.info(value)} />
}
