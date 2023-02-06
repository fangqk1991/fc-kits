import __CommonPermission from '../auto-build/__CommonPermission'

export class _CommonPermission extends __CommonPermission {
  public constructor() {
    super()
  }

  public static async permissionsForGroupId<T extends _CommonPermission>(this: { new (): T }, groupId: string) {
    const searcher = new this().fc_searcher()
    searcher.processor().addConditionKV('group_id', groupId)
    return searcher.queryFeeds()
  }
}
