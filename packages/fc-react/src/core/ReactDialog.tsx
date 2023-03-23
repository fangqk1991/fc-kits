import { ConfigProvider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'

export type DialogCallback<T = any> = (params: T) => void | Promise<void>

export interface DialogProps<T = any> {
  title?: string
  curValue?: T
  context: {
    handleResult: () => any
  }
}

interface Props extends DialogProps {
  title?: string
  width?: string | number
  dom: HTMLElement
  callback?: DialogCallback<any>
  children: any
  hideButtons?: boolean
}

export const BaseDialog: React.FC<Props> = (props) => {
  const [isOpen, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!isOpen) {
      props.dom.remove()
    }
  }, [isOpen])

  return (
    <Modal
      title={props.title}
      width={props.width}
      open={isOpen}
      destroyOnClose={true}
      onCancel={() => setOpen(false)}
      okButtonProps={{
        loading: loading,
      }}
      onOk={async () => {
        if (props.callback) {
          setLoading(true)
          const result = await props.context.handleResult()
          try {
            await props.callback(result)
            setLoading(false)
          } catch (e) {
            setLoading(false)
            throw e
          }
        }
        setOpen(false)
      }}
      footer={props.hideButtons ? null : undefined}
      maskClosable={!!props.hideButtons}
    >
      {props.children}
    </Modal>
  )
}

export abstract class ReactDialog<T extends DialogProps, P = any> {
  title: string = 'Title'
  width?: string | number
  hideButtons = false

  props!: Omit<T, 'context'>

  public constructor(props: Omit<T, 'context'>) {
    this.props = props
    if (props.title) {
      this.title = props.title
    }
  }

  public abstract rawComponent(): React.FC<T>

  public show(callback?: DialogCallback<P>) {
    const RawComponent = this.rawComponent()
    const context = {
      handleResult: () => null,
    }
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    const app = ReactDOM.createRoot(dom)
    app.render(
      <ConfigProvider
        theme={{
          token: {
            ...(ReactDialogTheme.colorPrimary
              ? {
                  colorPrimary: ReactDialogTheme.colorPrimary,
                }
              : {}),
          },
        }}
      >
        <BaseDialog
          title={this.title}
          width={this.width}
          dom={dom}
          context={context}
          hideButtons={this.hideButtons}
          callback={callback}
        >
          <RawComponent {...(this.props as any)} context={context} />
        </BaseDialog>
      </ConfigProvider>
    )
  }
}

export const ReactDialogTheme = {
  colorPrimary: '',
}
