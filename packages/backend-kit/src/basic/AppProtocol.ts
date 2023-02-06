import { SwaggerDocItem } from '@fangcha/router'

export interface AppProtocol {
  env: string
  tags?: string[]

  appName: string
  plugins: AppPluginProtocol[]

  checkHealth?: () => Promise<void>
  appDidLoad?: () => Promise<void>

  wecomBotKey?: string
  retainHealthWord?: string
}

export interface AppPluginProtocol {
  appDidLoad: (app: AppProtocol) => void | Promise<void>
  appWillLoad?: (app: AppProtocol) => void | Promise<void>
  resqueModuleMap?: { [p: string]: any }
  checkHealth?: () => void | Promise<void>
  specDocItems?: SwaggerDocItem[]
}
