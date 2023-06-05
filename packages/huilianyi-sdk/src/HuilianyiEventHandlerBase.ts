export abstract class HuilianyiEventHandlerBase<T> {
  public readonly formData: T

  constructor(formData: T) {
    this.formData = formData
  }

  public abstract onExecute(): Promise<string>
}
