import * as fs from 'fs'
import * as shell from 'shelljs'

const md5File = require('md5-file')

export class ReceivedFile {
  private _spacePath?: string
  private _hash?: string

  public static fileForSpace(spacePath: string) {
    const file = new ReceivedFile()
    file._spacePath = spacePath
    return file
  }

  public static fileWithSpaceAndTempPath(spacePath: string, tmpPath: string) {
    const file = ReceivedFile.fileForSpace(spacePath)
    file.moveFromUploadedFile(tmpPath)
    return file
  }

  public static fileWithSpaceAndHash(spacePath: string, fileHash: string) {
    const file = ReceivedFile.fileForSpace(spacePath)
    file.setExistsFileHash(fileHash)
    return file
  }

  public moveFromUploadedFile(tmpPath: string) {
    this._hash = md5File.sync(tmpPath)
    this._mkdirs()
    fs.renameSync(tmpPath, this.filePath())
  }

  public static fileWithSpaceAndTempPathUsingCopy(spacePath: string, tmpPath: string) {
    const file = ReceivedFile.fileForSpace(spacePath)
    file.copyFromUploadedFile(tmpPath)
    return file
  }

  public copyFromUploadedFile(tmpPath: string) {
    this._hash = md5File.sync(tmpPath)
    this._mkdirs()
    fs.copyFileSync(tmpPath, this.filePath())
  }

  public setExistsFileHash(hash: string) {
    this._hash = hash
  }

  private _fileDir() {
    const hash = this._hash as string
    return `${this._spacePath}/${hash.substr(0, 2)}/${hash.substr(2, 2)}`
  }

  public filePath() {
    return `${this._fileDir()}/${this._hash}`
  }

  public fileSize() {
    return fs.statSync(this.filePath()).size
  }

  public checkFileExists() {
    return fs.existsSync(this.filePath())
  }

  public getHash() {
    return this._hash
  }

  private _mkdirs() {
    const dir = this._fileDir()
    if (!fs.existsSync(dir)) {
      shell.exec(`mkdir -p ${dir}`)
    }
  }
}
