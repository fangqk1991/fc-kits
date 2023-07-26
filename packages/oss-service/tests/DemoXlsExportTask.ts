import { _OSSResource, OSSService, TaskHandlerProtocol } from '../src'
import { OSSProvider, ResourceTaskParams } from '../src/common/models'
import { BackendFile } from '@fangcha/tools/lib/file-backend'
import { makeUUID } from '@fangcha/tools'

interface Params {
  options: {}
  _userEmail: string
  _time: string
}

export class DemoXlsExportTask implements TaskHandlerProtocol {
  params: ResourceTaskParams

  constructor(rawParams: Params) {
    this.params = {
      userEmail: rawParams._userEmail,
      taskType: 'DemoXlsExportTask',
      rawParams: rawParams,
      fileName: `Demo_${rawParams._time}.xlsx`,
    }
  }

  public async private_submitTask(taskKey: string) {
    // await DatawichResque.requestResourceHandleTask(taskKey)
  }

  public async private_executeTask() {
    const rawParams = this.params.rawParams as Params
    const options = rawParams.options
    const downloader = OSSService.getDownloader()
    const file = downloader.saveContent('!!!!')
    // const file = downloader.saveTmpFile(tmpPath)
    const filePath = file.filePath()
    // const fileExt = BackendFile.getFileExt(filePath)
    // const ossKey = await ossTools.ossUtils.autoUpload(filePath, fileExt)
    const ossKey = makeUUID()

    return await _OSSResource.generateOSSResource({
      bucketName: 'fc-demo',
      ossKey: ossKey,
      provider: OSSProvider.Local,
      size: BackendFile.getFileSize(filePath),
      uploader: rawParams._userEmail || '',
      mimeType: BackendFile.getFileMime(filePath),
    })
  }
}
