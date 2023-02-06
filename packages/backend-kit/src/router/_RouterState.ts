import { RouterApp } from '@fangcha/router'
import { RouterPlugin } from './RouterPlugin'

class __RouterState {
  locked = false

  routerApp: RouterApp
  routerPlugin!: RouterPlugin

  constructor() {
    this.routerApp = new RouterApp({
      docItems: [],
    })
  }
}

export const _RouterState = new __RouterState()
