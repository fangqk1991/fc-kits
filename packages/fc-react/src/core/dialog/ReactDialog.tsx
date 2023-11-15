import { ConfigProvider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ReactTheme } from '../ReactTheme'

export type DialogCallback<T = any> = (params: T) => void | Promise<void>

export interface DialogProps<T = any> {
  title?: string
  curValue?: T
  context: {
    handleResult: () => any
    onClickSubmit: () => any
  }
}

interface Props extends DialogProps {
  title?: string
  width?: string | number
  dom: HTMLElement
  callback?: DialogCallback<any>
  children: any
  okText?: React.ReactNode
  closeIcon?: React.ReactNode
  hideButtons?: boolean
}

export const BaseDialog: React.FC<Props> = (props) => {
  const [isOpen, setOpen] = useState(true)
  const [loading, setLoading] = useState(false)
  const onOk = async () => {
    if (props.callback) {
      setLoading(true)
      try {
        const result = await props.context.handleResult()
        await props.callback(result)
        setLoading(false)
      } catch (e) {
        setLoading(false)
        throw e
      }
    }
    setOpen(false)
  }
  props.context.onClickSubmit = onOk

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
      onOk={onOk}
      okText={props.okText}
      footer={props.hideButtons ? null : undefined}
      maskClosable={!!props.hideButtons}
      closeIcon={props.closeIcon}
    >
      {props.children}
    </Modal>
  )
}

export abstract class ReactDialog<T extends DialogProps, P = any> {
  title: string = 'Title'
  width?: string | number
  okText?: React.ReactNode
  closeIcon?: React.ReactNode
  hideButtons = false

  props!: Omit<T, 'context'>

  public constructor(props: Omit<T, 'context'>) {
    this.props = props
  }

  public abstract rawComponent(): React.FC<T>

  public show(callback?: DialogCallback<P>) {
    const RawComponent = this.rawComponent()
    const context = {
      handleResult: () => null,
      onClickSubmit: () => {},
    }
    const dom = document.createElement('div')
    document.getElementsByTagName('body')[0].appendChild(dom)
    const app = ReactDOM.createRoot(dom)
    app.render(
      <ConfigProvider
        locale={ReactTheme.locale}
        theme={{
          token: {
            ...(ReactTheme.colorPrimary
              ? {
                  colorPrimary: ReactTheme.colorPrimary,
                }
              : {}),
          },
        }}
      >
        <BaseDialog
          title={this.props.title || this.title}
          width={this.width}
          dom={dom}
          context={context}
          hideButtons={this.hideButtons}
          okText={this.okText}
          closeIcon={this.closeIcon}
          callback={callback}
        >
          <RawComponent {...(this.props as any)} context={context} />
        </BaseDialog>
      </ConfigProvider>
    )
  }
}
