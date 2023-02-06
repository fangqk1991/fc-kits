import assert from '@fangcha/assert'
import { SpecFactory } from '@fangcha/router'
import { DownloadApis } from '../common/apis'
import { _ResourceTask, _UserResourceTask, OSSService, ResourceTaskHandler } from '../main'
import { ResourceTaskModel } from '../common/models'
import { FangchaSession } from '@fangcha/router/lib/session'

const factory = new SpecFactory('导出任务')

factory.prepare(DownloadApis.ResourceTaskPageDataGet, async (ctx) => {
  const session = ctx.session as FangchaSession
  const pageData = await _ResourceTask.getPageResult({
    ...ctx.request.query,
    lockedUser: session.curUserStr(),
  })
  pageData.items.forEach((item) => {
    OSSService.fillDownloadUrl(item as ResourceTaskModel)
  })
  ctx.body = pageData
})

factory.prepare(DownloadApis.ResourceTaskRetry, async (ctx) => {
  const session = ctx.session as FangchaSession
  const task = await _ResourceTask.findResourceTask(ctx.params.taskKey)
  assert.ok(!!task, 'Task Not Found')
  assert.ok(
    await _UserResourceTask.checkBelongs(session.curUserStr(), task.taskKey),
    `无权访问任务 ${task.taskKey} `,
    403
  )
  const clazz = OSSService.getTaskHandlerClazz(task.taskType)
  const handler = new clazz(task.rawParams())
  await new ResourceTaskHandler(handler).retryTask()
  ctx.status = 200
})

export const DownloadSpecs = factory.buildSpecs()
