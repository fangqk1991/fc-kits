import { HuilianyiEventHandlerBase } from './HuilianyiEventHandlerBase'

export class HuilianyiWebhookInitHandler extends HuilianyiEventHandlerBase {
  public async onExecute(requestData: { tenantId: string; companyOID: string }) {
    return {
      message: requestData.tenantId,
    }
  }
}
