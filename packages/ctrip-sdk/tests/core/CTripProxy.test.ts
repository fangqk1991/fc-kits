import { CustomRequestFollower } from '@fangcha/backend-kit'
import { CTripConfigTest } from '../CTripConfigTest'
import { CTripProxy } from '../../src'

describe('Test CTripProxy.test.ts', () => {
  const cTripProxy = new CTripProxy(CTripConfigTest, CustomRequestFollower)

  it(`searchOrder`, async () => {
    const items = await cTripProxy.searchOrder({
      from: '2023-06-25 00:00:00',
      to: '2023-06-26 00:00:00',
    })
    console.info(JSON.stringify(items, null, 2))
  })

  it(`queryOrderIdList`, async () => {
    const items = await cTripProxy.queryOrderIdList({
      from: '2023-06-25 00:00:00',
      to: '2023-06-26 00:00:00',
    })
    console.info(`${items.length} items`)
    console.info(JSON.stringify(items, null, 2))
  })

  it(`searchOrderItems`, async () => {
    const idList = Array.from(new Set([123, 456]))
    const items = await cTripProxy.searchOrderItems(idList)
    const totalCount = items.reduce(
      (result, cur) => result + (cur.FlightOrderInfoList?.length || 0) + (cur.TrainOrderInfoList?.length || 0),
      0
    )
    console.info(`${idList.length} ids -> ${totalCount} items`)
    // console.info(JSON.stringify(items, null, 2))
  })

  it(`searchOrdersStatusData`, async () => {
    const items = await cTripProxy.searchOrdersStatusData([])
    console.info(`${items.length} items`)
    console.info(JSON.stringify(items, null, 2))
  })
})
