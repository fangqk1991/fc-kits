import { HuilianyiService } from '../../src/HuilianyiService'
import { CTripConfigTest, HuilianyiConfigTest, HuilianyiDBTest } from '../HuilianyiConfigTest'

export const HuilianyiServiceDev = new HuilianyiService({
  authConfig: HuilianyiConfigTest,
  database: HuilianyiDBTest,
  ctripConfig: CTripConfigTest,
})
