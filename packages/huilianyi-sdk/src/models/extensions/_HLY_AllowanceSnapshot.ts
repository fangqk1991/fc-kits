import { _HLY_TravelAllowance } from './_HLY_TravelAllowance'

export class _HLY_AllowanceSnapshot extends _HLY_TravelAllowance {
  public constructor() {
    super()
  }

  public fc_defaultInit() {
    super.fc_defaultInit()
    this.isLocked = 0
  }

  public isLocked!: number

  public fc_propertyMapper() {
    const mapper = super.fc_propertyMapper()
    return {
      ...mapper,
      isLocked: 'is_locked',
    }
  }
}

_HLY_AllowanceSnapshot.addStaticOptions({
  table: 'hly_allowance_snapshot',
})

const protocol = _HLY_AllowanceSnapshot['_staticDBOptions']
_HLY_AllowanceSnapshot.addStaticOptions({
  cols: [...(protocol.cols as string[]), 'is_locked'],
  insertableCols: [...(protocol.insertableCols as string[]), 'is_locked'],
  modifiableCols: [...(protocol.modifiableCols as string[]), 'is_locked'],
})
