import { AppPluginProtocol } from '../basic'
import { CoreJob, CronJobManager } from '@fangcha/tools/lib/cron'
import { _FangchaState } from '../main'
import { logger } from '@fangcha/logger'

export const ScheduleSdkPlugin = (jobs: CoreJob[]): AppPluginProtocol => {
  return {
    appDidLoad: async () => {
      const manager = new CronJobManager()
      manager.setListener({
        onJobStart: async (coreJob: CoreJob) => {
          logger.info(`${coreJob.name}[${coreJob.uid}]: onJobStart`)
        },
        onJobDone: async (coreJob: CoreJob) => {
          logger.info(`${coreJob.name}[${coreJob.uid}]: onJobDone, time elapsed ${coreJob.elapsedMs}ms`)
        },
        onJobFailed: async (coreJob: CoreJob, err: Error) => {
          logger.info(`${coreJob.name}[${coreJob.uid}]: onJobFailed, time elapsed ${coreJob.elapsedMs}ms, error:`, err)
          const infos = ['', 'Schedule Job Fail', `Job: ${coreJob.name}`, `Error: ${err.message}`]
          _FangchaState.botProxy.notify(infos.join('\n'))
        },
      })

      manager.addScheduleJobList(jobs)
      manager.execute()
    },
  }
}
