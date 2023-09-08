import { _HLY_TravelAllowance } from './_HLY_TravelAllowance'

export class _HLY_AllowanceSnapshot extends _HLY_TravelAllowance {
  public constructor() {
    super()
  }

  public fc_defaultInit() {
    super.fc_defaultInit()
    this.isLocked = 0
    this.snapMonth = ''
    this.isPrimary = 0
  }

  public isLocked!: number
  public snapMonth!: string
  public isPrimary!: number

  public fc_propertyMapper() {
    const mapper = super.fc_propertyMapper()
    return {
      ...mapper,
      isLocked: 'is_locked',
      snapMonth: 'snap_month',
      isPrimary: 'is_primary',
    }
  }
}

_HLY_AllowanceSnapshot.addStaticOptions({
  table: 'hly_allowance_snapshot',
})

const protocol = _HLY_AllowanceSnapshot['_staticDBOptions']
_HLY_AllowanceSnapshot.addStaticOptions({
  primaryKey: ['uid', 'snap_month'],
  cols: [...(protocol.cols as string[]), 'is_locked', 'snap_month', 'is_primary'],
  insertableCols: [...(protocol.insertableCols as string[]), 'is_locked', 'snap_month', 'is_primary'],
  modifiableCols: [...(protocol.modifiableCols as string[]), 'is_locked', 'is_primary'],
})
