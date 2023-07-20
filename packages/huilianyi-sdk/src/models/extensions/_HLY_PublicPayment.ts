import { _HLY_Expense } from './_HLY_Expense'

export class _HLY_PublicPayment extends _HLY_Expense {
  public constructor() {
    super()
  }
}

_HLY_PublicPayment.addStaticOptions({
  table: 'hly_public_payment',
})
