import __CommonJob from '../auto-build/__CommonJob'
import { CommonJobState } from '../../../models'
import { ResqueJob } from '@fangcha/resque'
import { Transaction } from 'fc-sql'
import * as moment from 'moment'

export class _CommonJob extends __CommonJob {
  public static AppName = 'App'

  public constructor() {
    super()
  }

  /**
   * @param resqueJob
   * @param objectId [用于后期检索]
   */
  public static async saveResqueJobAndEnqueue<T extends _CommonJob>(
    this: { new (): T },
    resqueJob: ResqueJob,
    objectId?: string
  ) {
    const clazz = this as any as typeof _CommonJob
    const job = new this()
    job.jobId = resqueJob.getJobID()
    job.app = clazz.AppName
    job.queue = resqueJob.queue
    job.taskName = resqueJob.getClassName()
    job.taskState = CommonJobState.Pending
    job.paramsStr = JSON.stringify(resqueJob.getArguments())
    if (objectId) {
      job.objectId = objectId
    }
    await job.addToDB()
    await resqueJob.addToQueue()
    return job
  }

  private static async findJob<T extends _CommonJob>(this: { new (): T }, resqueJob: ResqueJob) {
    const clazz = this as any as typeof _CommonJob
    return (await clazz.findWithUid(resqueJob.getJobID())) as T
  }

  public static async onResqueJobFound(resqueJob: ResqueJob) {
    const job = await this.findJob(resqueJob)
    if (job) {
      job.fc_edit()
      job.taskState = CommonJobState.Running
      job.pendingElapsed = Date.now() - resqueJob.getEnqueueTime()
      await job.updateToDB()
    }
  }

  public static async onResqueJobDone(resqueJob: ResqueJob) {
    const job = await this.findJob(resqueJob)
    if (job) {
      job.fc_edit()
      job.taskState = CommonJobState.Done
      job.performElapsed = Date.now() - resqueJob.getEnqueueTime() - job.pendingElapsed
      await job.updateToDB()
    }
  }

  public static async onResqueJobFailed(resqueJob: ResqueJob, error: Error) {
    const job = await this.findJob(resqueJob)
    if (job) {
      job.fc_edit()
      job.taskState = CommonJobState.Fail
      job.performElapsed = Date.now() - resqueJob.getEnqueueTime() - job.pendingElapsed
      job.errorMessage = error.message
      await job.updateToDB()
    }
  }

  public onJobPerform(_: ResqueJob) {}

  public async onMarkTimeout(transaction?: Transaction) {
    this.fc_edit()
    this.taskState = CommonJobState.Fail
    if (!this.pendingElapsed) {
      this.pendingElapsed = Date.now() - moment(this.createTime).valueOf()
    } else if (!this.performElapsed) {
      this.performElapsed = Date.now() - moment(this.updateTime).valueOf()
    }
    this.errorMessage = 'Timeout'
    await this.updateToDB(transaction)
  }

  public async markObjectId(objectId: string) {
    this.fc_edit()
    this.objectId = objectId
    await this.updateToDB()
  }
}
