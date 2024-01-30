import React, { useEffect, useState } from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { LoadingView } from '../LoadingView'

interface Props extends DialogProps {
  element?: React.ReactNode
  loadElement?: () => Promise<React.ReactNode>
}

export class ReactPreviewDialog extends ReactDialog<Props> {
  title = 'Preview'
  width: string | number = 800
  hideButtons = true

  public static preview(element: React.ReactNode) {
    new ReactPreviewDialog({
      element: element,
    }).show()
  }

  public static asyncPreview(loadElement: () => Promise<React.ReactNode>) {
    new ReactPreviewDialog({
      loadElement: loadElement,
    }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [loading, setLoading] = useState(false)
      const [element, setElement] = useState(props.element)
      const [errMsg, setErrMsg] = useState('')
      useEffect(() => {
        if (props.loadElement) {
          setLoading(true)
          props
            .loadElement()
            .then((data) => {
              setLoading(false)
              setElement(data)
              setErrMsg('')
            })
            .catch((err) => {
              setLoading(false)
              setErrMsg(err.message)
              throw err
            })
        }
      }, [])

      if (loading) {
        return <LoadingView />
      }
      if (errMsg) {
        return <p>{errMsg}</p>
      }

      return <>{element}</>
    }
  }
}
