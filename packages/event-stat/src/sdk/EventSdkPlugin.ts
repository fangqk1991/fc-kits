import { AppPluginProtocol } from '@fangcha/backend-kit/lib/basic'
import { EventSpecDocItem } from '../specs'
import { FCDatabase } from 'fc-sql'
import { _EventStat } from '../services/_EventStat'

export const EventSdkPlugin = (database: FCDatabase): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      _EventStat.init(database)
    },
    specDocItem: EventSpecDocItem,
  }
}
