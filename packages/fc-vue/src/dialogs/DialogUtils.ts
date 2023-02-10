export interface DialogProtocol {
  dismiss: () => void
}

export type DialogCallback<T = any> = (params: T) => Promise<void> | void
