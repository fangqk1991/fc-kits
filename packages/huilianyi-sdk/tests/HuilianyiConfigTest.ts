import { GlobalAppConfig } from 'fc-config'
import { FCDatabase } from 'fc-sql'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'

export const HuilianyiConfigTest = GlobalAppConfig.HuilianyiSDK
export const CTripConfigTest = GlobalAppConfig.CTripSDK

export const HuilianyiDBTest = FCDatabase.instanceWithName('demoDB').init(
  new DBOptionsBuilder(GlobalAppConfig.HuilianyiDB).build() as any
)
