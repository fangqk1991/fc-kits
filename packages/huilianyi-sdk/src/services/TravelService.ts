import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { TravelTicketsDataInfo } from '../core/App_CoreModels'

export class TravelService {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async getTravelTicketsData(businessCode: string) {
    const HLY_OrderFlight = this.modelsCore.HLY_OrderFlight
    const HLY_OrderTrain = this.modelsCore.HLY_OrderTrain

    const ticketData: TravelTicketsDataInfo = {
      flightTickets: [],
      trainTickets: [],
    }
    {
      const searcher = new HLY_OrderFlight().fc_searcher()
      searcher.processor().addConditionKV('business_code', businessCode)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        ticketData.flightTickets.push(...item.modelForClient().extrasData.tickets)
      }
    }
    {
      const searcher = new HLY_OrderTrain().fc_searcher()
      searcher.processor().addConditionKV('business_code', businessCode)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        ticketData.trainTickets.push(...item.modelForClient().extrasData.tickets)
      }
    }
    return ticketData
  }
}
