import React, { useEffect, useState } from 'react'
import styled from '@emotion/styled'
import { DialogProps, ReactDialog } from './ReactDialog'
import { JsonPre } from './JsonPre'
import { LoadingView } from './LoadingView'

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

  public static loadDataAndPreview(loadData: () => Promise<{}>) {
    new TextPreviewDialog({
      loadData: loadData,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [loading, setLoading] = useState(false)
      const [content, setContent] = useState(props.curValue)
      useEffect(() => {
        if (props.loadData) {
          setLoading(true)
          props
            .loadData()
            .then((data) => {
              setLoading(false)
              setContent(data)
            })
            .catch((err) => {
              setLoading(false)
              throw err
            })
        }
      }, [])

      if (loading) {
        return <LoadingView />
      }

      return <JsonPre value={content} />
    }
  }
}
