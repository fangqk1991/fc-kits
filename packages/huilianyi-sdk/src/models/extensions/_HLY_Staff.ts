import __HLY_Staff from '../auto-build/__HLY_Staff'

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
}
