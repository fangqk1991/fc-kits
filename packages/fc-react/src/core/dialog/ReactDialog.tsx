import { ConfigProvider, Modal } from 'antd'
import React, { useEffect, useState } from 'react'
import ReactDOM from 'react-dom/client'
import { ReactTheme } from '../ReactTheme'
import { LoadingView } from '../LoadingView'

export type DialogCallback<T = any> = (params: T) => void | Promise<void>

export interface DialogContext {
  handleResult: () => any
  onClickSubmit: () => any
  dismiss: () => void
}

export interface DialogProps<T = any> {
  title?: string
  curValue?: T
  context: DialogContext
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
  maskClosable?: boolean
  escDisabled?: boolean
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
  props.context.dismiss = () => setOpen(false)

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
      style={{ top: '40px' }}
      destroyOnClose={true}
      onCancel={() => setOpen(false)}
      okButtonProps={{
        loading: loading,
      }}
      keyboard={!props.escDisabled}
      onOk={onOk}
      okText={props.okText}
      footer={props.hideButtons ? null : undefined}
      maskClosable={props.maskClosable && !!props.hideButtons}
      closeIcon={props.closeIcon}
    >
      {props.children}
    </Modal>
  )
}

const ContentContainer: React.FC<{
  loadData?: () => Promise<any>
  element: () => React.ReactNode
}> = (props) => {
  const [loading, setLoading] = useState(false)
  const [element, setElement] = useState<React.ReactNode>()
  const [errMsg, setErrMsg] = useState('')
  useEffect(() => {
    if (props.loadData) {
      setLoading(true)
      props
        .loadData()
        .then(() => {
          setLoading(false)
          setErrMsg('')
          setElement(props.element())
        })
        .catch((err) => {
          setLoading(false)
          setErrMsg(err.message)
          throw err
        })
    } else {
      setElement(props.element())
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

export abstract class ReactDialog<T extends DialogProps, P = any> {
  title: string = 'Title'
  width?: string | number
  okText?: React.ReactNode
  closeIcon?: React.ReactNode
  hideButtons = false
  maskClosable = true
  escDisabled = false

  props!: Omit<T, 'context'>
  context!: DialogContext

  public constructor(props: Omit<T, 'context'>) {
    this.props = props
    this.context = {
      handleResult: () => null,
      onClickSubmit: () => {},
      dismiss: () => {},
    }
  }

  public dismiss() {
    return this.context.dismiss()
  }

  public abstract rawComponent(): React.FC<T>

  loadData?: () => Promise<any>

  public show(callback?: DialogCallback<P>) {
    const RawComponent = this.rawComponent()
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
          context={this.context}
          hideButtons={this.hideButtons}
          maskClosable={this.maskClosable}
          escDisabled={this.escDisabled}
          okText={this.okText}
          closeIcon={this.closeIcon}
          callback={callback}
        >
          <ContentContainer
            loadData={this.loadData}
            element={() => <RawComponent {...(this.props as any)} context={this.context} />}
          />
        </BaseDialog>
      </ConfigProvider>
    )
  }
}
