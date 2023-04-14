import React from 'react'
import { DialogProps, ReactDialog } from './ReactDialog'
import { Descriptions } from 'antd'

interface Props extends DialogProps<any> {
  title: string
  infos: {
    label: string
    value?: string | number
    render?: (value?: string | number) => React.ReactElement
  }[]
}

export class InformationDialog extends ReactDialog<Props> {
  title = 'Preview'
  width = 800
  hideButtons = true

  public static previewData(data: Omit<Props, 'context'>) {
    new InformationDialog(data).show()
  }

  public rawComponent(): React.FC<Props> {
    return (props) => (
      <Descriptions bordered>
        {props.infos.map((option) => (
          <>
            <Descriptions.Item label={option.label}>
              {option.render ? option.render(option.value) : option.value}
            </Descriptions.Item>
          </>
        ))}
      </Descriptions>
    )
  }
}

React.createElement
