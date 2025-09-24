type Handler<T = any> = (args?: T) => void | Promise<void>
type ErrorHandler = (err: Error) => any

export class AppTask<T = any> {
  public readonly func: Handler<T>
  public readonly params?: T

  public constructor(func: Handler<T>, params?: T) {
    this.func = func
    this.params = params
    this._canceled = false
  }

  private _canceled: boolean

  public cancel() {
    this._canceled = true
  }

  public isCanceled() {
    return this._canceled
  }

  private _errHandler?: ErrorHandler
  public setErrorHandler(errHandler: ErrorHandler) {
    this._errHandler = errHandler
  }

  public error?: Error
  public async execute() {
    try {
      await this.func(this.params)
      return true
    } catch (e) {
      this.error = e as any
      if (this._errHandler) {
        await this._errHandler(e as Error)
      } else {
        console.error(e)
      }
      return false
    }
  }
}
