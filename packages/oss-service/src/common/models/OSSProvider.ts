import { Descriptor } from '@fangcha/tools'

export enum OSSProvider {
  Aliyun = 'Aliyun',
  AWS = 'AWS',
  Local = 'Local',
}

const values = [OSSProvider.Aliyun, OSSProvider.AWS]

const describe = (code: OSSProvider) => {
  return code
}

export const OSSProviderDescriptor = new Descriptor(values, describe)
