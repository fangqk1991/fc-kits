import { SpecFactory } from '@fangcha/router'
import { FangchaSession } from '@fangcha/session'
import { SdkEventStatApis } from '../common/apis'
import { _EventStat } from '../services/_EventStat'
import assert from '@fangcha/assert'

const factory = new SpecFactory('Event Stat')

factory.prepare(SdkEventStatApis.EventStat, async (ctx) => {
  const { eventType, content } = ctx.request.body
  assert.ok(typeof eventType === 'string', `eventType invalid`)
  const session = ctx.session as FangchaSession
  await _EventStat.stat({
    eventType: eventType,
    content: content || '-',
    visitor: session.curUserStr(),
  })
  ctx.status = 200
})

export const SdkEventStatSpecs = factory.buildSpecs()
