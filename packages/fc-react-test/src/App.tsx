import React from 'react'
import { ErrorBoundary } from '@ant-design/pro-components'
import { RouterProvider } from 'react-router-dom'
import { MyRouter } from './core/MyRouter'

export const App: React.FC = () => {
  return (
    <ErrorBoundary>
      <RouterProvider router={MyRouter}></RouterProvider>
    </ErrorBoundary>
  )
}
