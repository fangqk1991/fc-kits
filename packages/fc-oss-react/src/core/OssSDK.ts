interface Params {
  defaultBucketName: string
  defaultOssZone: string
}

class _OssSDK {
  options!: Params

  public init(options: Params) {
    this.options = options || {}
    return this
  }
}

export const OssSDK = new _OssSDK()
