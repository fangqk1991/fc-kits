import { ResqueWorker } from './ResqueWorker'
import { ResqueJob } from './ResqueJob'

export interface IResqueObserver {
  onMasterLaunched(): void | Promise<void>
  onWorkerStart(worker: ResqueWorker): void | Promise<void>
  onJobFound(job: ResqueJob): void | Promise<void>
  onJobPerform(job: ResqueJob): void | Promise<void>
  onJobDone(job: ResqueJob): void | Promise<void>
  onJobFailed(job: ResqueJob, e: Error): void | Promise<void>
  onTerminalProgressUpdated?(message: string): void | Promise<void>

  onRedisConnectionError?(error: Error): void | Promise<void>
}
