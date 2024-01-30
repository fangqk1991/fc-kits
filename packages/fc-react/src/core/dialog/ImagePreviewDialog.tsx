import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps<any> {
  imgSrc: string
}

export class ImagePreviewDialog extends ReactDialog<Props> {
  title = 'Preview'
  width: string | number = '90%'
  hideButtons = true

  public static preview(imgSrc: string) {
    new ImagePreviewDialog({ imgSrc: imgSrc }).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => <img width='100%' src={props.imgSrc} />
  }
}

React.createElement
