import { _CommonMember } from './models/extensions/_CommonMember'
import { _CommonPermission } from './models/extensions/_CommonPermission'
import { _CommonGroup } from './models/extensions/_CommonGroup'
import { FCDatabase } from 'fc-sql'
import { GroupSpace } from './common/models'
import { GroupBuilder } from './GroupBuilder'
import { GroupSearcher } from './GroupSearcher'

export class GeneralGroupApp {
  public readonly database: FCDatabase
  public readonly CommonGroup!: { new (): _CommonGroup<_CommonMember, _CommonPermission> }
  public readonly CommonMember!: { new (): _CommonMember }
  public readonly CommonPermission!: { new (): _CommonPermission }

  constructor(database: FCDatabase) {
    this.database = database
    class CommonMember extends _CommonMember {}
    class CommonPermission extends _CommonPermission {}
    class CommonGroup extends _CommonGroup<_CommonMember, _CommonPermission> {}
    CommonGroup.setClass_CommonMember(CommonMember)
    CommonGroup.setClass_CommonPermission(CommonPermission)
    CommonGroup.setDatabase(database)
    CommonMember.setDatabase(database)
    CommonPermission.setDatabase(database)
    this.CommonGroup = CommonGroup
    this.CommonMember = CommonMember
    this.CommonPermission = CommonPermission
  }

  public groupBuilder(space: GroupSpace, operator: string) {
    return new GroupBuilder(this, space, operator)
  }

  public groupSearcher(space: GroupSpace | GroupSpace[]) {
    return new GroupSearcher(this, space)
  }

  public async findGroup(groupId: string) {
    const CommonGroup = this.CommonGroup as typeof _CommonGroup
    return (await CommonGroup.findWithUid(groupId)) as _CommonGroup<_CommonMember, _CommonPermission>
  }
}
