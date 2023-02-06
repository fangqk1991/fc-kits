import { IResqueObserver, ResqueJob, ResqueWorker } from '@fangcha/resque'
import { _FangchaState } from '../main'
import { _CommonJob } from '@fangcha/general-job'

export class ResqueObserverHelper {
  public static makeDefaultObserver(): IResqueObserver {
    return {
      onMasterLaunched: () => {},
      onWorkerStart: (_worker: ResqueWorker) => {},
      onJobFound: async (_resqueJob: ResqueJob) => {},
      onJobDone: (_resqueJob: ResqueJob) => {},
      onJobFailed: async (resqueJob: ResqueJob, e: Error) => {
        console.error(resqueJob, e)
        const infos = [
          'Resque Job Fail',
          `Queue: ${resqueJob.queue}`,
          `Job: ${resqueJob.getClassName()}`,
          `Error: ${e.message}`,
        ]
        _FangchaState.botProxy.notify(infos.join('\n'))
      },
      onJobPerform: (_: ResqueJob) => {},
      onRedisConnectionError: (e: Error) => {
        const infos = ['Redis Connection Error', e.message]
        _FangchaState.botProxy.notify(infos.join('\n'))
      },
    }
  }

  public static makeTypicalObserver(CommonJob: typeof _CommonJob): IResqueObserver {
    let stoppingBeginTs = 0
    let lastAlertTs = 0

    return {
      onMasterLaunched: () => {},
      onWorkerStart: (_worker: ResqueWorker) => {},
      onJobFound: async (resqueJob: ResqueJob) => {
        await CommonJob.onResqueJobFound(resqueJob)
      },
      onJobDone: async (resqueJob: ResqueJob) => {
        await CommonJob.onResqueJobDone(resqueJob)
      },
      onJobFailed: async (resqueJob: ResqueJob, e: Error) => {
        const infos = [
          'Resque Job Fail',
          `Queue: ${resqueJob.queue}`,
          `Job: ${resqueJob.getClassName()}`,
          `Error: ${e.message}`,
        ]
        _FangchaState.botProxy.notify(infos.join('\n'))
        console.error(resqueJob, e)
        await CommonJob.onResqueJobFailed(resqueJob, e)
      },
      onJobPerform: (_: ResqueJob) => {},

      onTerminalProgressUpdated: (message: string) => {
        console.info(`onTerminalProgressUpdated: ${message}`)
        if (stoppingBeginTs === 0) {
          stoppingBeginTs = Date.now()
        } else {
          const now = Date.now()
          if (now - lastAlertTs > 1000 * 10) {
            lastAlertTs = now
            const waitingTs = now - stoppingBeginTs
            console.info(`Resque 需要等待任务结束才能关闭，当前已等待 ${(waitingTs / 1000).toFixed(2)}s`)
          }
        }
      },
      onRedisConnectionError: (e: Error) => {
        const infos = ['Redis Connection Error', e.message]
        _FangchaState.botProxy.notify(infos.join('\n'))
      },
    }
  }
}
