import { HuilianyiServiceDev } from './HuilianyiServiceDev'
import { CTrip_FlightChangeTypeDescriptor } from '@fangcha/ctrip-sdk'

describe('Test CTrip_Order.test.ts', () => {
  const huilianyiService = HuilianyiServiceDev

  it(`CTrip_Order`, async () => {
    const CTrip_Order = huilianyiService.modelsCore.CTrip_Order

    const searcher = new CTrip_Order().fc_searcher()
    searcher.processor().addConditionKV('order_status', '航班变更')
    const feeds = await searcher.queryFeeds()
    for (const item of feeds) {
      const changeInfo = item.flightChangeInfo()!
      console.info(
        `${CTrip_FlightChangeTypeDescriptor.describe(changeInfo.FlightChangeType)}: [${changeInfo.OriginFlight} ${
          changeInfo.OriginDPort
        } - ${changeInfo.OriginAPort}] ${changeInfo.OriginDdate} ~ ${changeInfo.OriginAdate} | [${
          changeInfo.ProtectFlight
        } ${changeInfo.ProtectDPort} - ${changeInfo.ProtectAPort}] ${changeInfo.ProtectDdate} ~ ${changeInfo.ProtectAdate}`
      )
      if (changeInfo.OriginFlight !== changeInfo.ProtectFlight) {
        console.info('===================')
      }
      // console.info(JSON.stringify(changeInfo, null, 2))
    }
  })
})
