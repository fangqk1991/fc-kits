import { HuilianyiEventHandlerBase } from './HuilianyiEventHandlerBase'

export class HuilianyiEmptyHandler extends HuilianyiEventHandlerBase {
  public async onExecute() {
    return {
      message: '',
    }
  }
}
