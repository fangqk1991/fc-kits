import { OSSService } from '../src'
import { GlobalAppConfig } from 'fc-config'
import { DemoXlsExportTask } from './DemoXlsExportTask'
import * as moment from 'moment'
import { FCDatabase } from 'fc-sql/lib'
import { DBOptionsBuilder } from '@fangcha/tools/lib/database'

describe('Test OSSService.test.ts', () => {
  FCDatabase.instanceWithName('demoDB').init(new DBOptionsBuilder(GlobalAppConfig.OssDemo.demoDB).build() as any)

  OSSService.init({
    database: FCDatabase.instanceWithName('demoDB') as any,
    defaultOssOptions: GlobalAppConfig.OssDemo.ossOptions.Default,
    optionsMapper: {
      'fc-demo': GlobalAppConfig.OssDemo.ossOptions.Default,
    },
    taskMapper: {
      DemoXlsExportTask: DemoXlsExportTask,
    },
    downloadRootDir: GlobalAppConfig.OssDemo.downloadDir,
  })

  it(`Test Normal`, async () => {
    const handler = new DemoXlsExportTask({
      options: {},
      _userEmail: 'fang@email.com',
      _time: `${moment().unix()}`,
    })
    const feed = await handler.private_executeTask()
    // await new ResourceTaskHandler(handler).executeTask()
    console.info(feed)
  })
})
