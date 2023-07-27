import { _OSSResource, OSSService, TaskHandlerProtocol } from '../src'
import { OSSProvider, ResourceTaskParams } from '../src/common/models'
import { BackendFile } from '@fangcha/tools/lib/file-backend'

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
    // const options = rawParams.options
    const downloader = OSSService.getDownloader()
    const tmpFile = downloader.saveContent('!!!!')
    const hash = tmpFile.getHash()!

    const fileExt = BackendFile.getFileExt(tmpFile.filePath())
    const size = BackendFile.getFileSize(tmpFile.filePath())
    const mimeType = BackendFile.getFileMime(tmpFile.filePath())
    const suffix = fileExt ? `.${fileExt}` : ''
    const ossKey = `${hash.substring(0, 2)}/${hash.substring(2, 4)}/${hash}${suffix}`

    downloader.moveTmpFileToTarget(tmpFile.filePath(), ossKey)

    return await _OSSResource.generateOSSResource({
      bucketName: 'fc-demo',
      ossKey: ossKey,
      provider: OSSProvider.Local,
      size: size,
      uploader: rawParams._userEmail || '',
      mimeType: mimeType,
    })
  }
}
