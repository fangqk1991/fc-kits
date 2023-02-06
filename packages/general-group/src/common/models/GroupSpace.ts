import { Descriptor, SelectOption } from '@fangcha/tools'

export enum GroupSpace {
  None = 'None',
  SimpleData = 'SimpleData',
  ModelRetainGroup = 'ModelRetainGroup',
  ModelCustomGroup = 'ModelCustomGroup',
}

const values = [GroupSpace.None, GroupSpace.SimpleData, GroupSpace.ModelRetainGroup, GroupSpace.ModelCustomGroup]

const describe = (code: GroupSpace) => {
  switch (code) {
    case GroupSpace.None:
      return 'None'
    case GroupSpace.SimpleData:
      return '简单数据'
    case GroupSpace.ModelRetainGroup:
      return '模型保留组'
    case GroupSpace.ModelCustomGroup:
      return '模型自定义组'
  }
  return 'Unknown'
}

export const GeneralModelSpaces = [GroupSpace.ModelRetainGroup, GroupSpace.ModelCustomGroup]

export const getModelSpaceOptions = () => {
  const options: SelectOption[] = [
    {
      label: '保留组',
      value: GroupSpace.ModelRetainGroup,
    },
    {
      label: '自定义组',
      value: GroupSpace.ModelCustomGroup,
    },
  ]
  return options
}

export const GroupSpaceDescriptor = new Descriptor(values, describe)
