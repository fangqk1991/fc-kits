import { Descriptor } from '@fangcha/tools'

export enum OSSStatus {
  Pending = 'Pending',
  Uploading = 'Uploading',
  Success = 'Success',
  Fail = 'Fail',
  Deleted = 'Deleted',
}

const values = [OSSStatus.Pending, OSSStatus.Uploading, OSSStatus.Success, OSSStatus.Fail, OSSStatus.Deleted]

const describe = (code: OSSStatus) => {
  return code
}

export const OSSStatusDescriptor = new Descriptor(values, describe)
