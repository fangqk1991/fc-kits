import { HuilianyiEventHandlerBase } from './HuilianyiEventHandlerBase'

export class HuilianyiEmptyHandler extends HuilianyiEventHandlerBase {
  public async onExecute() {
    console.warn('HuilianyiEmptyHandler is invoked.')
    return {
      message: '',
    }
  }
}
