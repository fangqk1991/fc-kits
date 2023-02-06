export class AppTask {
  private readonly _func: (args: any) => void | Promise<void>
  private readonly _params: any
  private _canceled: boolean

  public constructor(func: (args: any) => void | Promise<void>, params: any = undefined) {
    this._func = func
    this._params = params
    this._canceled = false
  }

  public cancel() {
    this._canceled = true
  }

  public isCanceled() {
    return this._canceled
  }

  public async execute() {
    try {
      await this._func(this._params)
      return true
    } catch (e) {
      console.error(e)
      return false
    }
  }
}
