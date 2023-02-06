import * as OSS from 'ali-oss'
import { loggerForDev } from '@fangcha/logger'
import { OSSUtils } from '@fangcha/ali-oss'

describe('Test OSSMigrate.test.ts', () => {
  // TODO: Fill options
  const fromVisitorOptions: any = {}
  const toUploaderOptions: any = {}
  const tmpDirPath = ''

  it(`Test migrate`, async () => {
    const downloadClient = new OSS(fromVisitorOptions)
    const response = await downloadClient.list(
      {
        prefix: 'general-data/',
        'max-keys': 1000,
      },
      {
        timeout: 30 * 1000,
      }
    )
    const ossKeyList = response.objects.map((item) => item.name)

    const uploadClient = new OSS(toUploaderOptions)

    const ossUtils = new OSSUtils()
    ossUtils.initDownloader(fromVisitorOptions, tmpDirPath)

    for (const remotePath of ossKeyList) {
      loggerForDev.info(`remotePath: ${remotePath}`)
      const filePath = await ossUtils.autoDownload(remotePath)
      loggerForDev.info(`${filePath} -> ${remotePath}`)
      await uploadClient.put(remotePath, filePath)
    }
  })
})
