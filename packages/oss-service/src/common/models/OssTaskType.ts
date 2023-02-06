import { Descriptor } from '@fangcha/tools'

export enum OssTaskType {
  Unknown = 'Unknown',
}

const values = [OssTaskType.Unknown]

const describe = (code: OssTaskType) => {
  return code
}

export const OssTaskTypeDescriptor = new Descriptor(values, describe)
