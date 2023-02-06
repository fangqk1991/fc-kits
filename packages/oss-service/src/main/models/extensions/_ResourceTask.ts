import __ResourceTask from '../auto-build/__ResourceTask'
import { ResourceTaskModel, ResourceTaskStatus } from '../../../common/models'

export class _ResourceTask extends __ResourceTask {
  taskStatus!: ResourceTaskStatus

  public constructor() {
    super()
  }

  public fc_searcher(params = {}) {
    const searcher = super.fc_searcher(params)
    if (params['lockedUser']) {
      searcher
        .processor()
        .addSpecialCondition(
          'EXISTS (SELECT user_resource_task.task_key FROM user_resource_task WHERE user_resource_task.task_key = resource_task.task_key AND user_resource_task.user_email = ?)',
          params['lockedUser']
        )
    }
    searcher.processor().addOrderRule('_rid', 'DESC')
    return searcher
  }

  public static async findResourceTask<T extends _ResourceTask>(this: { new (): T }, taskKey: string) {
    return (await (this as any).findOne({
      task_key: taskKey,
    })) as T
  }

  public rawParams() {
    let params: any = {}
    try {
      params = JSON.parse(this.rawParamsStr)
    } catch (e) {}
    return params
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient(): ResourceTaskModel {
    const data = this.fc_pureModel() as ResourceTaskModel
    data.downloadUrl = ''
    return data
  }
}
