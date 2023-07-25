import __HLY_Staff from '../auto-build/__HLY_Staff'
import { App_StaffModel } from '../../core'

export class _HLY_Staff extends __HLY_Staff {
  public constructor() {
    super()
  }

  public static async employeeIdToUserOidMapper() {
    const searcher = new this().fc_searcher()
    searcher.processor().setColumns(['employee_id', 'user_oid'])
    const feeds = await searcher.queryAllFeeds()
    return feeds.reduce((result, cur) => {
      result[cur.employeeId] = cur.userOid
      return result
    }, {} as { [p: string]: string })
  }

  public groupOids() {
    return this.groupOidsStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public groupCodes() {
    return this.groupCodesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public groupNames() {
    return this.groupNamesStr
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data = this.fc_pureModel() as App_StaffModel
    data.groupOids = this.groupOids()
    data.groupCodes = this.groupCodes()
    data.groupNames = this.groupNames()
    delete data['groupOidsStr']
    delete data['groupCodesStr']
    delete data['groupNamesStr']
    delete data['extrasInfo']
    delete data['createTime']
    delete data['updateTime']
    return data
  }
}
