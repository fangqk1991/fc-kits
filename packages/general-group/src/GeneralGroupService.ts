import { _CommonMember } from './models/extensions/_CommonMember'
import { _CommonPermission } from './models/extensions/_CommonPermission'
import { _CommonGroup } from './models/extensions/_CommonGroup'

class _GeneralGroupService {
  public getClass_CommonGroup(): typeof _CommonGroup {
    class CommonMember extends _CommonMember {}
    class CommonPermission extends _CommonPermission {}
    class CommonGroup extends _CommonGroup<_CommonMember, _CommonPermission> {}
    CommonGroup.setClass_CommonMember(CommonMember)
    CommonGroup.setClass_CommonPermission(CommonPermission)
    return CommonGroup as typeof _CommonGroup
  }

  public getClass_CommonMember(): typeof _CommonMember {
    class CommonMember extends _CommonMember {}
    return CommonMember
  }

  public getClass_CommonPermission(): typeof _CommonPermission {
    class CommonPermission extends _CommonPermission {}
    return CommonPermission
  }
}

export const GeneralGroupService = new _GeneralGroupService()
