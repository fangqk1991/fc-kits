import React, { useEffect, useState } from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { JsonPre } from '../JsonPre'
import { LoadingView } from '../LoadingView'

interface Props extends DialogProps<any> {
  loadData?: () => Promise<{}>
}

export class TextPreviewDialog extends ReactDialog<Props> {
  title = 'Preview'
  width: string | number = 800
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
