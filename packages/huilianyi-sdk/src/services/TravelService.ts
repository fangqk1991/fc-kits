import { HuilianyiModelsCore } from './HuilianyiModelsCore'
import { TravelTicketsDataInfo } from '../core/App_CoreModels'

export class TravelService {
  public readonly modelsCore: HuilianyiModelsCore

  constructor(modelsCore: HuilianyiModelsCore) {
    this.modelsCore = modelsCore
  }

  public async getTravelTicketsData(businessCode: string) {
    const mapper = await this.getTicketsDataMapper([businessCode])
    return mapper[businessCode]
  }

  public async getTicketsDataMapper(businessCodeList: string[]) {
    const HLY_OrderFlight = this.modelsCore.HLY_OrderFlight
    const HLY_OrderTrain = this.modelsCore.HLY_OrderTrain

    const ticketDataMapper: { [businessCode: string]: TravelTicketsDataInfo } = {}
    for (const businessCode of businessCodeList) {
      ticketDataMapper[businessCode] = {
        flightTickets: [],
        trainTickets: [],
      }
    }
    {
      const searcher = new HLY_OrderFlight().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        ticketDataMapper[item.businessCode].flightTickets.push(...item.modelForClient().extrasData.tickets)
      }
    }
    {
      const searcher = new HLY_OrderTrain().fc_searcher()
      searcher.processor().addConditionKeyInArray('business_code', businessCodeList)
      const feeds = await searcher.queryAllFeeds()
      for (const item of feeds) {
        ticketDataMapper[item.businessCode].trainTickets.push(...item.modelForClient().extrasData.tickets)
      }
    }
    return ticketDataMapper
  }
}
