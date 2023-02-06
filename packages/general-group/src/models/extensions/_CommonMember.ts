import __CommonMember from '../auto-build/__CommonMember'

export class _CommonMember extends __CommonMember {
  public constructor() {
    super()
  }

  public static async membersForGroupId<T extends _CommonMember>(this: { new (): T }, groupId: string) {
    const searcher = new this().fc_searcher()
    searcher.processor().addConditionKV('group_id', groupId)
    return searcher.queryFeeds()
  }

  public async updateLevel(isAdmin: number) {
    this.fc_edit()
    this.isAdmin = isAdmin
    await this.updateToDB()
  }
}
