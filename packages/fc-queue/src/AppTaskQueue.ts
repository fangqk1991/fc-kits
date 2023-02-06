import { AppQueue } from './AppQueue'
import { AppTask } from './AppTask'

export class AppTaskQueue {
  private readonly _runningQueue: AppQueue<AppTask>
  private readonly _pendingQueue: AppQueue<AppTask>
  private readonly _failureQueue: AppQueue<AppTask>
  private _maxConcurrent: number
  private _running: boolean
  private _processedCount: number
  private _pendingLimit: number
  private _emptyCallback?: () => void | Promise<void>
  public autoPauseWhenRunningQueueEmpty: boolean

  public constructor() {
    this._runningQueue = new AppQueue()
    this._pendingQueue = new AppQueue()
    this._failureQueue = new AppQueue()
    this._maxConcurrent = 1
    this._running = false
    this._processedCount = 0
    this._pendingLimit = -1
    this.autoPauseWhenRunningQueueEmpty = false
  }

  public setMaxConcurrent(count: number) {
    if (count > 0) {
      this._maxConcurrent = Number(count)
    }
  }

  public setPendingLimit(limit: number) {
    if (limit >= 0) {
      this._pendingLimit = Number(limit)
    } else {
      this._pendingLimit = -1
    }
  }

  public isRunning() {
    return this._running
  }

  public checkFullLoad() {
    return (
      this._pendingLimit >= 0 &&
      this._pendingQueue.size() + this._runningQueue.size() >= this._maxConcurrent + this._pendingLimit
    )
  }

  public addTask(task: AppTask) {
    if (this.checkFullLoad()) {
      return false
    }

    this._pendingQueue.push(task)
    this._trigger()
    return true
  }

  public resume() {
    this._running = true
    this._trigger()
  }

  public pause() {
    this._running = false
  }

  public async syncExecute() {
    return new Promise((resolve) => {
      this.setOnEmptyCallback(resolve as any)
      this.resume()
    })
  }

  public _trigger() {
    if (!this.isRunning()) {
      return
    }

    while (this._runningQueue.size() < this._maxConcurrent && this._pendingQueue.size() > 0) {
      const task = this._pendingQueue.popFirst()
      if (!task.isCanceled()) {
        this._runningQueue.push(task)
        task.execute().then((result: boolean) => {
          if (result) {
            this._runningQueue.popFirst()
            ++this._processedCount
          } else {
            this._runningQueue.popFirst()
            this._failureQueue.push(task)
          }
          this._trigger()
        })
      }
    }

    if (this._runningQueue.size() === 0) {
      if (this.autoPauseWhenRunningQueueEmpty) {
        this.pause()
      }
      this._emptyCallback && this._emptyCallback()
    }
  }

  public setOnEmptyCallback(callback: () => void | Promise<void>) {
    this._emptyCallback = callback
  }

  public runningQueue() {
    return this._runningQueue
  }

  public pendingQueue() {
    return this._pendingQueue
  }

  public failureQueue() {
    return this._failureQueue
  }

  public processedCount() {
    return this._processedCount
  }
}
