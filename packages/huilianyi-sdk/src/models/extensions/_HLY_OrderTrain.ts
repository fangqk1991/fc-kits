import { _HLY_TravelAllowance } from './_HLY_TravelAllowance'

export class _HLY_AllowanceSnapshot extends _HLY_TravelAllowance {
  public constructor() {
    super()
  }
}

_HLY_AllowanceSnapshot.addStaticOptions({
  table: 'hly_allowance_snapshot',
})
