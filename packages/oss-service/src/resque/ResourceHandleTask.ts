import { IResqueTask } from '@fangcha/resque'
import { _ResourceTask, OSSService, ResourceTaskHandler } from '../main'

export class ResourceHandleTask implements IResqueTask {
  public async perform({ taskKey }: { taskKey: string }) {
    const task = await _ResourceTask.findResourceTask(taskKey)
    const clazz = OSSService.getTaskHandlerClazz(task.taskType)
    const handler = new clazz(task.rawParams())
    await new ResourceTaskHandler(handler).executeTask()
  }
}
