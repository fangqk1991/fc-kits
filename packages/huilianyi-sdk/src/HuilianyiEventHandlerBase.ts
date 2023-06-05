export abstract class HuilianyiEventHandlerBase {
  public constructor() {}

  public abstract onExecute<T = {}>(requestData: T): Promise<string>
}
