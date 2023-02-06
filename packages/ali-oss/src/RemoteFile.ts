export class RemoteFile {
  private _remoteRootDir?: string
  private _hash?: string
  private _fileExt?: string

  public static fileWithHash(rootDir: string, hash: string, fileExt: string) {
    const file = new RemoteFile()
    file._remoteRootDir = rootDir
    file._hash = hash
    file._fileExt = fileExt
    return file
  }

  public remotePath() {
    const hash = this._hash as string
    const suffix = this._fileExt ? `.${this._fileExt}` : ''
    return `${this._remoteRootDir}/${hash.substr(0, 2)}/${hash.substr(2, 2)}/${hash}${suffix}`
  }
}
