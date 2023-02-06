import { Descriptor } from '@fangcha/tools'

export enum GroupLevel {
  Public = 'Public',
  Protected = 'Protected',
  Private = 'Private',
}

const values = [GroupLevel.Public, GroupLevel.Protected, GroupLevel.Private]

const describe = (code: GroupLevel) => {
  return code
}

export const GroupLevelDescriptor = new Descriptor(values, describe)
