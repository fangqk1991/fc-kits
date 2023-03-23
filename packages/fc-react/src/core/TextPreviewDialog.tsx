import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { DialogProps, ReactDialog } from './ReactDialog'
import { JsonPre } from './JsonPre'

const Pre = styled.pre(`
  white-space: pre-wrap;
  word-wrap: break-word;
  margin-top: 0;
  margin-bottom: 0;
  line-height: 1.5;
  padding: 8px;
  border: 1px solid #e0e5e8;
`)

interface Props extends DialogProps<any> {
  loadData?: () => Promise<{}>
}

export class TextPreviewDialog extends ReactDialog<Props> {
  title = 'Preview'
  width = 800
  hideButtons = true

  public static previewData(data: any) {
    new TextPreviewDialog({
      curValue: data,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [content, setContent] = useState(props.curValue)
      useEffect(() => {
        if (props.loadData) {
          props.loadData().then((data) => {
            setContent(data)
          })
        }
      }, [])
      return <JsonPre value={content} />
    }
  }
}
