import { FCDatabase } from 'fc-sql'
import { _StatEvent } from '../models/extensions/_StatEvent'
import { _EventLog } from '../models/extensions/_EventLog'
import { EventOptions } from '../common/models'
import { md5 } from '@fangcha/tools'

class __EventStat {
  public database!: FCDatabase

  public init(database: FCDatabase) {
    this.database = database
    _StatEvent.setDatabase(database)
    _EventLog.setDatabase(database)
  }

  public async stat(options: EventOptions) {
    const runner = this.database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      const event = new _StatEvent()
      event.eventType = options.eventType || '-'
      event.content = typeof options.content === 'object' ? JSON.stringify(options.content) : `${options.content}`
      event.eventId = md5(`${event.eventType}:${event.content}`)
      await event.weakAddToDB(transaction)

      const eventLog = new _EventLog()
      eventLog.eventId = event.eventId
      eventLog.visitor = options.visitor || ''
      await eventLog.addToDB(transaction)
    })
  }
}

export const _EventStat = new __EventStat()
