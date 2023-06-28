import __HLY_Invoice from '../auto-build/__HLY_Invoice'
import { App_Invoice } from '../../core/App_CoreModels'
import { HLY_Invoice } from '../../core/HLY_InvoiceModels'

export class _HLY_Invoice extends __HLY_Invoice {
  public constructor() {
    super()
  }

  public extrasData(): any {
    const defaultData: HLY_Invoice = {} as any
    try {
      return JSON.parse(this.extrasInfo) || defaultData
    } catch (e) {}
    return defaultData
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_Invoice
    data.extrasData = this.extrasData()
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
