import __Dummy_Travel from '../auto-build/__Dummy_Travel'
import { DummyTravelModel, HLY_TravelStatus } from '../../core'
import { Transaction } from 'fc-sql'

export class _Dummy_Travel extends __Dummy_Travel {
  applicantOid!: string
  travelStatus!: HLY_TravelStatus

  public constructor() {
    super()
  }

  public static async findWithBusinessCode(businessCode: string) {
    return (await this.findOne({
      business_code: businessCode,
    }))!
  }

  public fc_searcher(params = {}) {
    const searcher = super.fc_searcher(params)
    searcher.processor().addConditionKeyNotInArray('travel_status', [HLY_TravelStatus.Deleted])
    return searcher
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    return this.fc_pureModel() as DummyTravelModel
  }

  public async deleteFromDB(transaction?: Transaction) {
    this.fc_edit()
    ++this.version
    this.travelStatus = HLY_TravelStatus.Deleted
    await this.updateToDB(transaction)
  }
}
