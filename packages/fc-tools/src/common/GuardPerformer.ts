type Handler<T> = () => Promise<T>
type ErrorHandler = (err: Error) => void | Promise<void>

export class GuardPerformer {
  public maxTimes = 3

  public constructor(maxTimes = 3) {
    this.maxTimes = maxTimes
  }

  public async handle<T>(handler: Handler<T>, onFailHandler?: ErrorHandler) {
    let remainingTimes = this.maxTimes
    let err!: Error
    while (remainingTimes--) {
      try {
        return await handler()
      } catch (e) {
        err = e as any
        console.error(e)
        if (onFailHandler) {
          await onFailHandler(err)
        }
      }
    }
    throw err
  }

  public static async perform<T>(handler: Handler<T>, onFailHandler?: ErrorHandler) {
    const performer = new GuardPerformer()
    return await performer.handle(handler, onFailHandler)
  }
}
