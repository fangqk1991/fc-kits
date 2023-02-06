export interface OpenVisitor {
  visitorId: string
  name: string
  secrets: string[]
  permissionKeys: string[]
  isEnabled: boolean
}
