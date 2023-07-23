import __HLY_StaffGroup from '../auto-build/__HLY_StaffGroup'
import { App_StaffGroupModel } from '../../core/App_StaffModels'

export class _HLY_StaffGroup extends __HLY_StaffGroup {
  public constructor() {
    super()
  }

  public static async wholeGroupMapper() {
    const groups = await new this().fc_searcher().queryAllFeeds()
    return groups.reduce((result, cur) => {
      result[cur.groupOid] = cur
      return result
    }, {} as { [p: string]: _HLY_StaffGroup })
  }

  public toJSON() {
    return this.modelForClient()
  }

  public modelForClient() {
    const data: App_StaffGroupModel = {
      groupOid: this.groupOid,
      groupCode: this.groupCode || '',
      groupName: this.groupName,
      isEnabled: this.isEnabled,
    }
    return data
  }
}
