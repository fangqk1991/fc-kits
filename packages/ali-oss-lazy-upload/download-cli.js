#!/usr/bin/env node

const { AliyunOSS } = require('@fangcha/ali-oss')

const assert = require('assert')
const path = require('path')
const fs = require('fs')

const [,, configJsFile, remotePath, localPath, overwrite] = process.argv

assert.ok(configJsFile && localPath && remotePath, 'Please use command: ali-oss-download CONFIG-JS-FILE REMOTE-PATH LOCAL-PATH [OVER-WRITE]')
assert.ok(fs.existsSync(path.resolve('', configJsFile)), 'Config file does not exist.')
assert.ok(!fs.existsSync(localPath) || overwrite, 'The file of local path exists, you can use overwrite mode.')

const config = require(path.resolve('', configJsFile))
const visitor = new AliyunOSS(config.visitor)

const main = async () => {
  try {
    await visitor.download(remotePath, localPath)
  } catch (e) {
    console.error(e)
    process.exit(1)
  }
  process.exit()
}

main()
