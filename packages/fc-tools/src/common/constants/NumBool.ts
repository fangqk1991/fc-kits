import { Descriptor } from '../Descriptor'

export enum NumBool {
  True = 1,
  False = 0,
}

const values = [NumBool.True, NumBool.False]

const describe = (code: NumBool) => {
  switch (code) {
    case NumBool.False:
      return '否'
    case NumBool.True:
      return '是'
  }
  return 'Unknown'
}

export const NumBoolDescriptor = new Descriptor(values, describe)
