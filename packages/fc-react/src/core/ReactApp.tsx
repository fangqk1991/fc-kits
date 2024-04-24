import React from 'react'
import ReactDOM from 'react-dom/client'

interface Params {
  mainNode: React.ReactNode
}

export class ReactApp {
  options: Params

  public constructor(options: Params) {
    this.options = options
  }

  public launch(children: React.ReactNode) {
    window['_app'] = this
    const app = ReactDOM.createRoot(document.getElementById('app')!)
    app.render(<React.StrictMode>{children}</React.StrictMode>)
  }
}
