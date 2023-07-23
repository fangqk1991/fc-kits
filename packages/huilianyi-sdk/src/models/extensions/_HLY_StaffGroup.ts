import __HLY_StaffGroup from '../auto-build/__HLY_StaffGroup'

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
}
