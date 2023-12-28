import React from 'react'
import { Button, Divider, message } from 'antd'
import { RichTextEditor } from '@fangcha/react/rich-text'
import { ReactPreviewDialog } from '@fangcha/react'

export const TestTextEditor: React.FC = () => {
  const content = `<p><span style="background-color: rgb(230, 0, 0);">1</span></p>
<p><span style="background-color: rgb(230, 0, 0);">2</span></p><p><span style="background-color: rgb(230, 0, 0);">3</span></p><p><span style="background-color: rgb(230, 0, 0);">4</span></p><p><span style="background-color: rgb(230, 0, 0);">5</span></p>`
  return (
    <div>
      <Button
        onClick={() =>
          ReactPreviewDialog.preview(<RichTextEditor value={content} onChange={(value) => message.info(value)} />)
        }
      >
        Modal
      </Button>
      <Divider />
      <RichTextEditor value={content} onChange={(value) => message.info(value)} />
    </div>
  )
}
