import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'

export const TestTextEditor: React.FC = () => {
  const [value, setValue] = useState('')

  return (
    <ReactQuill
      style={{ minHeight: '300px' }}
      theme='snow'
      value={value}
      onChange={setValue}
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
  )
}
