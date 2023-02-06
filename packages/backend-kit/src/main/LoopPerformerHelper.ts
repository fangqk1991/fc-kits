import { LoopPerformer } from '@fangcha/tools'
import { _FangchaState } from './_FangchaState'
import { logger } from '@fangcha/logger'

export class LoopPerformerHelper {
  public static makeLoopPerformer(period = 60 * 1000) {
    return new LoopPerformer({
      period: period,
      errorHandler: (e) => {
        _FangchaState.botProxy.notify(`LoopPerformer failed. ${e.message}`)
        logger.error(e)
      },
    })
  }

  public static loopHandle(handler: () => Promise<void>) {
    const performer = this.makeLoopPerformer()
    performer.execute(handler)
  }
}
