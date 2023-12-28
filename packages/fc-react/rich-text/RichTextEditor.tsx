import React from 'react'
import ReactQuill, { ReactQuillProps } from 'react-quill'
import styled from '@emotion/styled'
import 'react-quill/dist/quill.snow.css'

const Wrapper = styled.div`
  .ql-container.ql-snow {
    min-height: 100px;
  }
`

export const RichTextEditor: React.FC<ReactQuillProps> = (props) => {
  const [enabled, setEnabled] = React.useState(false)
  React.useEffect(() => {
    setEnabled(true)
  }, [])

  if (!enabled) {
    return null
  }

  return (
    <Wrapper>
      <ReactQuill
        theme='snow'
        modules={{
          toolbar: [
            ['bold', 'italic', 'underline'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }],
            [{ size: ['small', false, 'large', 'huge'] }],
            [{ header: [1, 2, 3, 4, 5, 6, false] }],
            [{ color: [] }, { background: [] }],
            ['link'],
          ],
        }}
        {...props}
      />
    </Wrapper>
  )
}
