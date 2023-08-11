import { _HLY_Travel } from './_HLY_Travel'

export class _Dummy_Travel extends _HLY_Travel {
  public constructor() {
    super()
  }
}

_Dummy_Travel.addStaticOptions({
  table: 'dummy_travel',
})
