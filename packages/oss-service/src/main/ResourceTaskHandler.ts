import { md5 } from '@fangcha/tools'
import { _ResourceTask } from './models/extensions/_ResourceTask'
import { ResourceTaskParams, ResourceTaskStatus } from '../common/models'
import { _OSSResource } from './models/extensions/_OSSResource'
import { OSSService } from './OSSService'
import assert from '@fangcha/assert'
import { _UserResourceTask } from './models/extensions/_UserResourceTask'

export interface TaskHandlerProtocol {
  params: ResourceTaskParams
  private_submitTask: (taskKey: string) => Promise<void>
  private_executeTask: () => Promise<_OSSResource>
}

export class ResourceTaskHandler {
  public readonly taskHandler: TaskHandlerProtocol
  private _resourceTask!: _ResourceTask

  public constructor(handler: TaskHandlerProtocol) {
    this.taskHandler = handler
  }

  public async prepareTask() {
    if (!this._resourceTask) {
      const params = this.taskHandler.params
      const sortedKeys = Object.keys(params).sort()
      const pairs: string[] = []
      for (const key of sortedKeys) {
        if (params[key]) {
          pairs.push(`_.${key}=${JSON.stringify(params[key])}`)
        }
      }

      const items: string[] = []
      items.push(`taskType=${params.taskType}`)
      items.push(`version=${OSSService.version}`)
      items.push(...pairs)
      const taskKey = md5(items.join('&'))
      let resourceTask = await _ResourceTask.findResourceTask(taskKey)
      const runner = new _ResourceTask().dbSpec().database.createTransactionRunner()
      await runner.commit(async (transaction) => {
        if (!resourceTask) {
          resourceTask = new _ResourceTask()
          resourceTask.taskKey = taskKey
          resourceTask.taskType = params.taskType
          resourceTask.fileName = params.fileName || ''
          resourceTask.taskStatus = ResourceTaskStatus.Pending
          resourceTask.rawParamsStr = JSON.stringify(params.rawParams)
          resourceTask.current = 0
          resourceTask.total = 1
          await resourceTask.addToDB(transaction)
        }
        if (params.userEmail) {
          const userResource = new _UserResourceTask()
          userResource.taskKey = resourceTask.taskKey
          userResource.userEmail = params.userEmail
          await userResource.weakAddToDB(transaction)
        }
      })
      this._resourceTask = resourceTask
    }
    return this._resourceTask
  }

  public async lazySubmitTask() {
    const resourceTask = await this.prepareTask()
    if (
      resourceTask.taskStatus !== ResourceTaskStatus.Success &&
      resourceTask.taskStatus !== ResourceTaskStatus.Processing
    ) {
      await this.submitTask()
    }
    return resourceTask
  }

  public async submitTask() {
    const resourceTask = await this.prepareTask()
    assert.ok(resourceTask.taskStatus !== ResourceTaskStatus.Success, `${resourceTask.taskKey} is already done`)
    assert.ok(resourceTask.taskStatus !== ResourceTaskStatus.Processing, `${resourceTask.taskKey} is in processing`)
    await this.taskHandler.private_submitTask(resourceTask.taskKey)
    return resourceTask
  }

  public async executeTask(override = false) {
    const resourceTask = await this.prepareTask()
    if (resourceTask.taskStatus === ResourceTaskStatus.Success && !override) {
      return
    }
    resourceTask.fc_edit()
    resourceTask.taskStatus = ResourceTaskStatus.Processing
    await resourceTask.updateToDB()

    try {
      const resource = await this.taskHandler.private_executeTask()
      resourceTask.fc_edit()
      resourceTask.resourceId = resource.resourceId
      resourceTask.provider = resource.provider
      resourceTask.bucketName = resource.bucketName
      resourceTask.ossKey = resource.ossKey
      resourceTask.mimeType = resource.mimeType
      resourceTask.size = resource.size
      resourceTask.current = 1
      resourceTask.taskStatus = ResourceTaskStatus.Success
      resourceTask.errorMessage = ''
      await resourceTask.updateToDB()
    } catch (e: any) {
      resourceTask.fc_edit()
      resourceTask.taskStatus = ResourceTaskStatus.Fail
      resourceTask.errorMessage = e.message
      await resourceTask.updateToDB()
      throw e
    }
  }

  public async retryTask() {
    const resourceTask = await this.prepareTask()
    resourceTask.fc_edit()
    resourceTask.taskStatus = ResourceTaskStatus.Pending
    resourceTask.errorMessage = ''
    await resourceTask.updateToDB()
    await this.submitTask()
  }
}
