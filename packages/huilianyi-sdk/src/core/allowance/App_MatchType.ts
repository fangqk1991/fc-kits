import { Descriptor } from '@fangcha/tools'

export enum App_MatchType {
  Including = 'Including',
  Excluding = 'Excluding',
}

const values = [App_MatchType.Including, App_MatchType.Excluding]

const describe = (code: App_MatchType) => {
  switch (code) {
    case App_MatchType.Including:
      return '包含'
    case App_MatchType.Excluding:
      return '不包含'
  }
  return code
}

export const App_MatchTypeDescriptor = new Descriptor(values, describe)
