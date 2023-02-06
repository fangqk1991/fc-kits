import { AliyunOSS } from './AliyunOSS'
import { RemoteFile } from './RemoteFile'
import { ReceivedFile } from './ReceivedFile'
import * as assert from 'assert'
import * as OSS from 'ali-oss'
import { AliOSSOptions, AliUploadMetadata, UploadSignatureOptions } from './OSSTypes'
import { makeUUID } from '@fangcha/tools'

const md5File = require('md5-file')
const crypto = require('crypto')

export class OSSUtils {
  private _uploadClient?: AliyunOSS
  private _remoteRootDir: string
  private _downloadClient?: AliyunOSS
  private _localSpacePath: string
  private _signOptions?: UploadSignatureOptions

  public constructor() {
    this._remoteRootDir = ''
    this._localSpacePath = ''
  }

  public initUploader(options: AliOSSOptions, remoteRootDir: string) {
    this._uploadClient = new AliyunOSS(options)
    this._remoteRootDir = remoteRootDir
  }

  public uploadClient() {
    return this._uploadClient as AliyunOSS
  }

  public initDownloader(options: AliOSSOptions, localSpacePath: string) {
    this._downloadClient = new AliyunOSS(options)
    this._localSpacePath = localSpacePath
  }

  public downloadClient() {
    return this._downloadClient as AliyunOSS
  }

  public async autoUpload(localPath: string, extension = '') {
    if (!extension) {
      extension = localPath.split('.').pop() as string
      if (extension === localPath || /[^a-zA-Z0-9]/.test(extension)) {
        extension = ''
      }
    }
    const hash = md5File.sync(localPath)
    const file = RemoteFile.fileWithHash(this._remoteRootDir, hash, extension)
    const client = this._uploadClient as AliyunOSS
    return client.uploadFile(localPath, file.remotePath())
  }

  public async autoDownload(remotePath: string) {
    const localPath = `${this._localSpacePath}/${makeUUID()}`
    const client = this._downloadClient as AliyunOSS
    await client.download(remotePath, localPath)
    const file = ReceivedFile.fileForSpace(this._localSpacePath)
    file.moveFromUploadedFile(localPath)
    return file.filePath()
  }

  public async getContent(remotePath: string) {
    const client = this._downloadClient as AliyunOSS
    return client.getContent(remotePath)
  }

  public signatureURL(objKey: string, options: OSS.SignatureUrlOptions = {}) {
    const client = this._downloadClient as AliyunOSS
    return client.signatureURL(objKey, options)
  }

  public initSignatureOptions(options: UploadSignatureOptions) {
    this._signOptions = options
  }

  public generateUploadMetadata(remotePath: string, fileSize: number) {
    assert.ok(!!this._signOptions, `signOptions should not be empty`)

    const signOptions = this._signOptions!
    fileSize = Number(fileSize)
    const expiration = new Date()
    expiration.setSeconds(expiration.getSeconds() + signOptions.timeout + fileSize / 1024 / 20)
    const expire = expiration.toISOString()
    const conditions = [
      ['content-length-range', fileSize, fileSize],
      ['eq', '$key', remotePath],
    ]
    const policy = JSON.stringify({
      expiration: expire,
      conditions: conditions,
    })
    const policyBase64 = Buffer.from(policy).toString('base64')
    const signature = crypto
      .createHmac('sha1', signOptions.accessKeySecret)
      .update(policyBase64)
      .digest()
      .toString('base64')

    return {
      url: signOptions.bucketURL,
      params: {
        OSSAccessKeyId: signOptions.accessKeyId,
        policy: policyBase64,
        Signature: signature,
        key: remotePath,
        success_action_status: 200,
      },
    } as AliUploadMetadata
  }

  public buildThumbnailOptions(width?: number, height?: number) {
    if (!width && !height) {
      return {}
    }
    const items = ['image/resize']
    if (width) {
      items.push(`w_${width}`)
    }
    if (height) {
      items.push(`h_${height}`)
    }
    return {
      process: items.join(','),
    }
  }
}
