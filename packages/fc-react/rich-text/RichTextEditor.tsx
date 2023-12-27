import React from 'react'
import ReactQuill from 'react-quill'
import styled from '@emotion/styled'
import 'react-quill/dist/quill.snow.css'

const Wrapper = styled.div`
  .ql-container.ql-snow {
    min-height: 100px;
  }
`

interface Props {
  value?: string
  onChange?: (value: string) => void
}

export const RichTextEditor: React.FC<Props> = (props) => {
  return (
    <Wrapper>
      <ReactQuill
        theme='snow'
        value={props.value || ''}
        onChange={props.onChange}
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
      />
    </Wrapper>
  )
}
