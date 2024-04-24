import React from 'react'
import ReactDOM from 'react-dom/client'
import { createBrowserRouter, RouteObject, RouterProvider } from 'react-router-dom'
import { ReactTheme } from './ReactTheme'
import { RouteErrorBoundary } from '../error/RouteErrorBoundary'

interface Params {
  colorPrimary?: string
  mainLayout: React.ReactNode
  routes: RouteObject[]
}

export class ReactApp {
  options: Params

  public constructor(options: Params) {
    this.options = options
    if (options.colorPrimary) {
      ReactTheme.colorPrimary = options.colorPrimary
    }
  }

  public launch() {
    window['_app'] = this
    const router = createBrowserRouter([
      {
        path: '/',
        element: this.options.mainLayout,
        errorElement: <RouteErrorBoundary />,
        children: [
          ...this.options.routes,
          {
            path: '*',
            element: <div>404 Not Found</div>,
          },
        ],
      },
    ])
    const app = ReactDOM.createRoot(document.getElementById('app')!)
    app.render(
      <React.StrictMode>
        <RouterProvider router={router}></RouterProvider>
      </React.StrictMode>
    )
  }
}
