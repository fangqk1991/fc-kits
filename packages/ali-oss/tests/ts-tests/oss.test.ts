import { AliyunOSS, OSSHelper, OSSUtils, ReceivedFile, RemoteFile } from '../../src'

import * as fs from 'fs'
import * as assert from 'assert'
import { axiosGET, axiosPOST } from '@fangcha/app-request'
import { makeUUID } from '@fangcha/tools'

const config = require('../config')
const md5File = require('md5-file')

const remoteRootDir = 'uploads'
const downloadRootDir = `${__dirname}/../run.local/downloads`
const spacePath = `${__dirname}/../run.local/fileSpace`

const generateFile = () => {
  const filePath = `${__dirname}/../run.local/random.txt`
  const content = `Some value: ${Math.random()}`
  fs.writeFileSync(filePath, content)
  assert.ok(fs.existsSync(filePath))
  return filePath
}

const generateRemoteObject = async () => {
  const filePath = generateFile()
  const hash = md5File.sync(filePath)
  const file = RemoteFile.fileWithHash(remoteRootDir, hash, 'txt')

  const uploadClient = new AliyunOSS(config.aliyunOSS.uploader)
  const remotePath = file.remotePath()
  return uploadClient.uploadFile(filePath, remotePath)
}

const assertFail = async (func: Function) => {
  try {
    await func()
    assert.fail()
  } catch (e) {
    return e as any
  }
}

describe('File', () => {
  it(`Test ReceivedFile`, async () => {
    const filePath = generateFile()
    const file = ReceivedFile.fileForSpace(spacePath)
    file.moveFromUploadedFile(filePath)
    assert.ok(!fs.existsSync(filePath))
    assert.ok(fs.existsSync(file.filePath()))
  })
})

describe('Test OSS', () => {
  it(`Test AliyunOSS`, async () => {
    const objKey = await generateRemoteObject()
    const localPath = `${__dirname}/../run.local/${makeUUID()}`
    const visitClient = new AliyunOSS(config.aliyunOSS.visitor)
    const filePath2 = await visitClient.download(objKey, localPath)
    assert.ok(localPath === filePath2)
    assert.ok(fs.existsSync(filePath2))

    const content = await visitClient.getContent(objKey)
    assert.ok(content === fs.readFileSync(localPath, 'utf8'))
    fs.unlinkSync(localPath)
  })

  it(`Test signatureURL`, async () => {
    const objKey = await generateRemoteObject()
    const visitClient = new AliyunOSS(config.aliyunOSS.visitor)
    const url = visitClient.signatureURL(objKey)
    console.info(url)
    await axiosGET(url).quickSend()
  })

  it(`Test OSSHelper`, async () => {
    const filePath = generateFile()
    const rawContent = fs.readFileSync(filePath, 'utf8')

    OSSHelper.initUploader(config.aliyunOSS.uploader, remoteRootDir)
    OSSHelper.initDownloader(config.aliyunOSS.visitor, downloadRootDir)

    const objKey = await OSSHelper.autoUpload(filePath)
    const filePath2 = await OSSHelper.autoDownload(objKey)
    assert.ok(rawContent === fs.readFileSync(filePath2, 'utf8'))
    assert.ok(rawContent === (await OSSHelper.getContent(objKey)))

    const url = OSSHelper.signatureURL(objKey)
    const request = axiosGET(url)
    const content = await request.quickSend()
    assert.ok(rawContent === content)

    const rawURL = url.split('?')[0]
    const err = await assertFail(async () => {
      const request = axiosGET(rawURL)
      await request.quickSend()
    })
    assert.ok(err.statusCode === 403)
  })

  it(`Test upload-metadata[OSSHelper]`, async () => {
    const filePath = generateFile()
    const hash = md5File.sync(filePath)
    const file = RemoteFile.fileWithHash(remoteRootDir, hash, 'txt')

    OSSHelper.initUploader(config.aliyunOSS.uploader, remoteRootDir)
    OSSHelper.initDownloader(config.aliyunOSS.visitor, downloadRootDir)
    OSSHelper.initSignatureOptions(config.aliyunOSS.uploadSignature)

    const metadata = OSSHelper.generateUploadMetadata(file.remotePath(), fs.statSync(filePath).size)
    const params = metadata.params as any
    params['file'] = fs.createReadStream(filePath)
    const request = axiosPOST(metadata.url)
    request.setFormData(params)
    await request.quickSend()
    assert.ok((await OSSHelper.getContent(file.remotePath())) === fs.readFileSync(filePath, 'utf8'))
  })

  it(`Test OSSUtils`, async () => {
    const filePath = generateFile()
    const rawContent = fs.readFileSync(filePath, 'utf8')

    const ossUtils = new OSSUtils()
    ossUtils.initUploader(config.aliyunOSS.uploader, remoteRootDir)
    ossUtils.initDownloader(config.aliyunOSS.visitor, downloadRootDir)

    const objKey = await ossUtils.autoUpload(filePath)
    const filePath2 = await ossUtils.autoDownload(objKey)
    assert.ok(rawContent === fs.readFileSync(filePath2, 'utf8'))
    assert.ok(rawContent === (await ossUtils.getContent(objKey)))

    const url = ossUtils.signatureURL(objKey)
    const request = axiosGET(url)
    const content = await request.quickSend()
    assert.ok(rawContent === content)

    const rawURL = url.split('?')[0]
    const err = await assertFail(async () => {
      const request = axiosGET(rawURL)
      await request.quickSend()
    })
    assert.ok(err.statusCode === 403)
  })

  it(`Test upload-metadata[OSSUtils]`, async () => {
    const filePath = generateFile()
    const hash = md5File.sync(filePath)
    const file = RemoteFile.fileWithHash(remoteRootDir, hash, 'txt')

    const ossUtils = new OSSUtils()
    ossUtils.initUploader(config.aliyunOSS.uploader, remoteRootDir)
    ossUtils.initDownloader(config.aliyunOSS.visitor, downloadRootDir)
    ossUtils.initSignatureOptions(config.aliyunOSS.uploadSignature)

    const metadata = ossUtils.generateUploadMetadata(file.remotePath(), fs.statSync(filePath).size)
    const params = metadata.params as any
    params['file'] = fs.createReadStream(filePath)
    const request = axiosPOST(metadata.url)
    request.setFormData(params)
    await request.quickSend()
    assert.ok((await ossUtils.getContent(file.remotePath())) === fs.readFileSync(filePath, 'utf8'))
  })
})
