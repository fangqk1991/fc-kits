export abstract class HuilianyiEventHandlerBase {
  public constructor() {}

  public abstract onExecute(requestData: any): Promise<
    | {
        message: string
      }
    | {
        body: {}
      }
  >
}
