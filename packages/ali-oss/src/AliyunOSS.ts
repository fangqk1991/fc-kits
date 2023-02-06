import * as OSS from 'ali-oss'
import * as fs from 'fs'
import * as shell from 'shelljs'
import { AliOSSOptions } from './OSSTypes'
import { GuardPerformer } from '@fangcha/tools'

export class AliyunOSS {
  private _options: AliOSSOptions
  private _client: OSS

  public constructor(options: AliOSSOptions) {
    this._options = options
    this._client = new OSS(options)
  }

  public async uploadFile(localPath: string, remotePath: string) {
    return await GuardPerformer.perform(async () => {
      const response = await this._client.put(remotePath, localPath)
      return response.name as string
    })
  }

  public async download(remotePath: string, localPath: string) {
    const dir = localPath.split('/').slice(0, -1).join('/')
    AliyunOSS._mkdirs(dir)
    await this._client.get(remotePath, localPath)
    return localPath
  }

  public async checkExists(remotePath: string): Promise<boolean> {
    try {
      await this._client.head(remotePath)
      return true
    } catch (e: any) {
      if (e.name === 'NoSuchKeyError') {
        return false
      } else {
        throw e
      }
    }
  }

  public async getContent(remotePath: string) {
    const response = await this._client.get(remotePath)
    return response.content.toString()
  }

  public signatureURL(remotePath: string, options: OSS.SignatureUrlOptions = {}) {
    let url = this._client.signatureUrl(remotePath, options)
    if (this._options.secure) {
      url = url.replace(/^http:/, 'https:')
    }
    return url
  }

  public static _mkdirs(dir: string) {
    if (!fs.existsSync(dir)) {
      shell.exec(`mkdir -p ${dir}`)
      // fs.mkdirSync(dir, {
      //   recursive: true,
      //   mode: 0o755
      // } as any)
    }
  }
}
