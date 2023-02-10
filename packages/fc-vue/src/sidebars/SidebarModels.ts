export enum VisibleLevel {
  Public = 'Public',
  Protected = 'Protected',
  Private = 'Private',
}

export interface MenuMainNode {
  uid?: string
  titleEn: string
  titleZh: string
  icon: string
  links: MenuSubNode[]
  visible?: boolean | (() => boolean)
}

export interface MenuSubNode {
  titleEn: string
  titleZh: string
  path?: string
  isHyperlink?: boolean
  url?: string
  onClick?: () => void | Promise<void>
  visibleLevel?: VisibleLevel
  visible?: boolean | (() => boolean)
}
