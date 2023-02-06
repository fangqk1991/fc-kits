#!/usr/bin/env node

const { AliyunOSS } = require('@fangcha/ali-oss')

const assert = require('assert')
const path = require('path')
const fs = require('fs')

const [,, configJsFile, localPath, remotePath, forceUpload] = process.argv

assert.ok(configJsFile && localPath && remotePath, 'Please use command: ali-oss-lazy-upload CONFIG-JS-FILE LOCAL-FILE REMOTE-PATH [FORCE-UPLOAD]')
assert.ok(fs.existsSync(path.resolve('', configJsFile)), 'Config file does not exist.')
assert.ok(fs.existsSync(localPath), 'The file of local path does not exist.')

const config = require(path.resolve('', configJsFile))
const uploader = new AliyunOSS(config.uploader)
const visitor = new AliyunOSS(config.visitor)

const formatSize = (size) => {
  let unit
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  while ((unit = units.shift()) && size > 1024) {
    size = size / 1024
  }
  return `${unit === 'B' ? size : size.toFixed(2)}${unit}`
}

const syncFile = async (localFile, remotePath) => {
  const fileSize = fs.statSync(localFile).size
  console.info(`Sync ${localFile}[${formatSize(fileSize)}] => ${remotePath}`)
  if (!fs.existsSync(localFile)) {
    console.error(`Local file [${localFile}] does not exist.`)
    return
  }
  if (fs.statSync(localFile).isDirectory()) {
    const files = fs.readdirSync(localFile)
    for (const fileName of files) {
      await syncFile(`${localFile}/${fileName}`, `${remotePath}/${fileName}`)
    }
  } else {
    if (await visitor.checkExists(remotePath)) {
      console.info(`--- Remote file[${remotePath} exists.`)
      if (!forceUpload) {
        console.info(`--- Skip the local file [${localFile}]`)
        return
      }
    }
    const start = Date.now()
    await uploader.uploadFile(localFile, remotePath)
    const duration = (Date.now() - start) / 1000
    console.info(`Time elapsed: ${duration.toFixed(2)}s`)
  }
}

const main = async () => {
  try {
    await syncFile(localPath, remotePath)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  process.exit()
}

main()
