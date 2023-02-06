import { ReceivedFile } from '@fangcha/ali-oss'
import * as fs from 'fs'
import * as shell from 'shelljs'
import { makeUUID } from '@fangcha/tools'
import { AxiosBuilder } from '@fangcha/app-request'

export class MyDownloader {
  private readonly _rootDir: string

  public constructor(spacePath: string) {
    this._rootDir = spacePath
    if (!fs.existsSync(this._rootDir)) {
      shell.exec(`mkdir -p ${this._rootDir}`)
    }
  }

  public async download(request: AxiosBuilder) {
    request.addAxiosConfig({
      responseType: 'arraybuffer',
    })
    const tmpPath = this.randomTmpPath()
    const buffer = await request.quickSend()
    fs.writeFileSync(tmpPath, buffer)
    return ReceivedFile.fileWithSpaceAndTempPath(this._rootDir, tmpPath)
  }

  public getFile(hash: string) {
    return ReceivedFile.fileWithSpaceAndHash(this._rootDir, hash)
  }

  public randomTmpPath() {
    return `${this._rootDir}/${makeUUID()}`
  }

  public saveBuffer(buffer: Buffer | ArrayBuffer) {
    const tmpPath = this.randomTmpPath()
    fs.writeFileSync(tmpPath, buffer as any)
    return ReceivedFile.fileWithSpaceAndTempPath(this._rootDir, tmpPath)
  }

  public saveContent(content: string) {
    const tmpPath = this.randomTmpPath()
    fs.writeFileSync(tmpPath, content)
    return ReceivedFile.fileWithSpaceAndTempPath(this._rootDir, tmpPath)
  }

  public createTmpBuffer() {
    const tmpPath = this.randomTmpPath()
    return {
      filepath: tmpPath,
      buffer: fs.createWriteStream(tmpPath),
    }
  }

  public saveTmpFile(tmpPath: string) {
    return ReceivedFile.fileWithSpaceAndTempPath(this._rootDir, tmpPath)
  }
}
