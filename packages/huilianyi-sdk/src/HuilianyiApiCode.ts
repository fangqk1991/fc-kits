import { Descriptor } from '@fangcha/tools'

export enum HuilianyiApiCode {
  INIT = 'INIT',
}

const values = [HuilianyiApiCode.INIT]

const describe = (code: HuilianyiApiCode) => {
  return code
}

export const HuilianyiApiCodeDescriptor = new Descriptor(values, describe)
