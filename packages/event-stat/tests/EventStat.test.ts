import { _EventStat } from '../src'
import { FCDatabase } from 'fc-sql'
import { EventDBOptions } from '../tools/db-config'

FCDatabase.instanceWithName('event').init(EventDBOptions as any)
_EventStat.init(FCDatabase.instanceWithName('event'))

describe('Test EventStat.test.ts', () => {
  it(`Test stat`, async () => {
    for (let i = 0; i < 10; ++i) {
      await _EventStat.stat({
        eventType: 'Hyperlink',
        content: `https://google.com/`,
        visitor: `${Math.random()}`,
      })
    }
  })
})
