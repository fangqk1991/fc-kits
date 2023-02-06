export interface PermissionProtocol {
  checkUserIsAdmin: (email: string) => boolean
  checkUserHasPermission: (email: string, permissionKey: string) => boolean
  checkUserInAnyGroup: (email: string, ...groupIds: string[]) => boolean
}
