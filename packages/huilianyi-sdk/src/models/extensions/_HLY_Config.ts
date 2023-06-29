import __HLY_Config from '../auto-build/__HLY_Config'

export class _HLY_Config extends __HLY_Config {
  public constructor() {
    super()
  }

  public configData(): any {
    try {
      const entity = JSON.parse(this.configDataStr) as any
      return entity && entity.data !== undefined ? entity.data : null
    } catch (e) {}
    return null
  }
}
