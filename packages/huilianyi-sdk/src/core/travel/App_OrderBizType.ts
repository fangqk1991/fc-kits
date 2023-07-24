import { Descriptor } from '@fangcha/tools'

export enum App_OrderBizType {
  HasBusinessCode = 'HasBusinessCode',
  SpecialOrder = 'SpecialOrder',
  Others = 'Others',
}

const values = [App_OrderBizType.HasBusinessCode, App_OrderBizType.SpecialOrder, App_OrderBizType.Others]

const describe = (code: App_OrderBizType) => {
  switch (code) {
    case App_OrderBizType.HasBusinessCode:
      return '有关联申请单'
    case App_OrderBizType.SpecialOrder:
      return '紧急预定'
    case App_OrderBizType.Others:
      return '其他'
  }
  return code
}

export const App_OrderBizTypeDescriptor = new Descriptor(values, describe)
