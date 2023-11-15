import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './core/MyRouter'
import { ReactTheme } from '@fangcha/react'

ReactTheme.colorPrimary = 'rgb(221 115 164)'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={MyRouter}></RouterProvider>
    </ErrorBoundary>
  )
}
