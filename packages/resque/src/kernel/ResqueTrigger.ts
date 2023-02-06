import { ResqueJob } from './ResqueJob'
import { IResqueObserver } from './IResqueObserver'
import { ResqueWorker } from './ResqueWorker'
import { Resque } from './Resque'
const moment = require('moment')

const log = (msg: string) => {
  console.log(`${moment().format()} ${msg}`)
}

export class ResqueTrigger implements IResqueObserver {
  public async onMasterLaunched() {
    log(`*** Resque Launched ***`)
    for (const observer of Resque.observers()) {
      await observer.onMasterLaunched()
    }
  }
  public async onWorkerStart(worker: ResqueWorker) {
    log(`*** Starting worker: ${worker.getID()}`)
    for (const observer of Resque.observers()) {
      await observer.onWorkerStart(worker)
    }
  }

  public async onJobFound(job: ResqueJob) {
    log(`onJobFound: ${job.getDescription()}`)
    for (const observer of Resque.observers()) {
      await observer.onJobFound(job)
    }
  }

  public async onJobPerform(job: ResqueJob) {
    log(`onJobPerform: ${job.getDescription()}`)
    for (const observer of Resque.observers()) {
      await observer.onJobPerform(job)
    }
  }

  public async onJobDone(job: ResqueJob) {
    log(`onJobDone: ${job.getDescription()}`)
    for (const observer of Resque.observers()) {
      await observer.onJobDone(job)
    }
  }

  public async onJobFailed(job: ResqueJob, e: Error) {
    log(`onJobFailed: ${job.getDescription()}`)
    for (const observer of Resque.observers()) {
      await observer.onJobFailed(job, e)
    }
  }

  public async onTerminalProgressUpdated(message: string) {
    log(`onTerminalProgressUpdated: ${message}`)
    for (const observer of Resque.observers()) {
      if (observer.onTerminalProgressUpdated) {
        await observer.onTerminalProgressUpdated(message)
      }
    }
  }

  public async onRedisConnectionError(error: Error) {
    log(`onRedisConnectionError: ${error}`)
    for (const observer of Resque.observers()) {
      if (observer.onRedisConnectionError) {
        await observer.onRedisConnectionError(error)
      }
    }
  }
}
