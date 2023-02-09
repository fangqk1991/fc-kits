import { Resque } from './Resque'
import { TaskCenter } from '../job/TaskCenter'
import { ResqueQueue } from './ResqueQueue'
import { makeUUID } from '@fangcha/tools'

interface JobPayload {
  id: string
  class: string
  args?: Record<string, unknown>
  queue_time?: number
}

export class ResqueJob {
  public queue: string
  public payload: JobPayload

  public constructor(queue: string, payload: JobPayload) {
    this.queue = queue
    this.payload = Object.assign({}, payload)

    if (!payload.args) {
      this.payload.args = {}
    }

    if (!payload.id) {
      this.payload.id = makeUUID().replace(/-/g, '')
    }
  }

  public getArguments() {
    return this.payload.args
  }

  public getJobID() {
    return this.payload.id
  }

  public getClassName() {
    return this.payload.class
  }

  public getEnqueueTime() {
    return this.payload.queue_time || 0
  }

  public async addToQueue() {
    const queue = this.queue
    if (!this.payload.queue_time) {
      this.payload.queue_time = Date.now()
    }
    const data = JSON.stringify(this.payload)

    await Resque.redis().sadd('resque:queues', queue)
    await Resque.redis().rpush(`resque:queue:${queue}`, data)
  }

  public static generate(queue: string, className: string, args: Record<string, unknown> = {}) {
    if (typeof args !== 'object') {
      throw new Error('Supplied $args must be an object.')
    }
    return new ResqueJob(queue, {
      class: className,
      args: args,
      id: makeUUID(),
      queue_time: Date.now(),
    })
  }

  public static async generateWithoutRepeatedJobInQueue(
    queue: string,
    className: string,
    args: Record<string, unknown> = {}
  ) {
    if (typeof args !== 'object') {
      throw new Error('Supplied $args must be an object.')
    }

    const jobs = await ResqueQueue.getJobsInQueue(queue)
    const hasRepeatedJob = jobs.find((job) => job.payload.class === className)
    if (hasRepeatedJob) {
      return null
    }

    return new ResqueJob(queue, {
      class: className,
      args: args,
      id: makeUUID(),
      queue_time: Date.now(),
    })
  }

  /**
   * @deprecated Please use generate and addToQueue instead.
   * @param queue
   * @param className
   * @param args
   */
  public static async create(queue: string, className: string, args: Record<string, unknown> = {}) {
    const job = ResqueJob.generate(queue, className, args)
    await job.addToQueue()
    return job
  }

  public async perform() {
    const className = this.getClassName()
    const Clazz = TaskCenter.findTask(className)

    if (!className || !Clazz) {
      throw new Error(`Could not find job class ${className}.`)
    }

    const task = new Clazz()
    // if (!(task instanceof IResqueTask)) {
    //   throw new Error(`${className} do not extend IResqueTask`)
    // }

    await task.perform(this.getArguments())
  }

  public async recreate() {
    const job = ResqueJob.generate(this.queue, this.getClassName(), this.getArguments())
    await job.addToQueue()
    return job
  }

  public getDescription() {
    const arr = [
      `Job{${this.queue}}]`,
      `ID: ${this.getJobID()}`,
      this.getClassName(),
      JSON.stringify(this.getArguments()),
    ]
    return `(${arr.join(' | ')})`
  }
}
