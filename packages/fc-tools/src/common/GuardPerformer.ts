type Handler<T> = () => Promise<T>

export class GuardPerformer {
  public maxTimes = 3

  public constructor(maxTimes = 3) {
    this.maxTimes = maxTimes
  }

  public async handle<T>(handler: Handler<T>, onFailHandler?: () => void | Promise<void>) {
    let remainingTimes = this.maxTimes
    let err!: Error
    while (remainingTimes--) {
      try {
        return await handler()
      } catch (e) {
        err = e as any
        console.error(e)
        if (onFailHandler) {
          await onFailHandler()
        }
      }
    }
    throw err
  }

  public static async perform<T>(handler: Handler<T>, onFailHandler?: () => void | Promise<void>) {
    const performer = new GuardPerformer()
    return await performer.handle(handler, onFailHandler)
  }
}
