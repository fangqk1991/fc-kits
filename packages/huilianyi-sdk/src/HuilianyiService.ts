import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { HuilianyiSyncCore } from './services/HuilianyiSyncCore'
import { HuilianyiSyncHandler } from './services/HuilianyiSyncHandler'
import { HuilianyiModelsCore } from './services/HuilianyiModelsCore'
import { MonthAllowanceMaker } from './services/MonthAllowanceMaker'
import { TravelService } from './services/TravelService'
import { SystemConfigHandler } from './services/SystemConfigHandler'
import { PublicPaymentService } from './services/PublicPaymentService'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiService {
  public readonly syncCore: HuilianyiSyncCore
  public readonly modelsCore: HuilianyiModelsCore

  constructor(options: Options) {
    this.modelsCore = new HuilianyiModelsCore(options.database)
    this.syncCore = new HuilianyiSyncCore({
      authConfig: options.authConfig,
      modelsCore: this.modelsCore,
    })
  }

  public syncHandler() {
    return new HuilianyiSyncHandler(this.syncCore)
  }

  public monthAllowanceMaker() {
    return new MonthAllowanceMaker(this.syncCore)
  }

  public travelService() {
    return new TravelService(this.modelsCore)
  }

  public configHandler() {
    return new SystemConfigHandler(this.syncCore)
  }

  public publicPaymentService() {
    return new PublicPaymentService(this.syncCore)
  }

  public async syncAndRefreshData(forceReload?: boolean) {
    const syncHandler = this.syncHandler()

    await syncHandler.dumpExpenseApplicationRecords(forceReload)
    await syncHandler.dumpExpenseRecords(forceReload)
    await syncHandler.dumpPublicPaymentRecords(forceReload)
    // await syncHandler.dumpInvoiceRecords(forceReload)

    await syncHandler.dumpTravelRecords(forceReload)
    await this.travelService().refreshTravelParticipants()

    await syncHandler.dumpStaffGroupRecords()
    await syncHandler.dumpStaffRecords()
    await syncHandler.dumpOrderFlightRecords(forceReload)
    await syncHandler.dumpOrderTrainRecords(forceReload)
    await syncHandler.dumpOrderHotelRecords(forceReload)

    await this.travelService().fillTravelOrdersBusinessCode()
    await this.travelService().makeCommonTrafficTickets()
    await this.travelService().refreshTravelTicketItemsData()
    await this.monthAllowanceMaker().makeMonthAllowance()
    await this.monthAllowanceMaker().removeExpiredAllowanceRecords()
  }
}
