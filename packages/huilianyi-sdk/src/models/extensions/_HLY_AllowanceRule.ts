import __HLY_AllowanceRule from '../auto-build/__HLY_AllowanceRule'
import { App_AllowanceRuleModel } from '../../core/allowance/App_AllowanceModels'

export class _HLY_AllowanceRule extends __HLY_AllowanceRule {
  public constructor() {
    super()
  }

  public roleList() {
    return this.roleListStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public cityList() {
    return this.cityListStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_AllowanceRuleModel
    data.roleList = this.roleList()
    data.cityList = this.cityList()
    delete data['roleListStr']
    delete data['cityListStr']
    return data
  }
}
