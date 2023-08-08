import { createBrowserRouter } from 'react-router-dom'
import React from 'react'
import { MainLayout } from './MainLayout'
import { LoadingView, RouteErrorBoundary } from '@fangcha/react'
import { TestTableView } from '../pages/table/TestTableView'
import { TestDialogsView } from '../pages/TestDialogsView'
import { TestWidgetsView } from '../pages/TestWidgetsView'
import { TestFormsView } from '../pages/TestFormsView'
import { TestRoutersView } from '../pages/TestRoutersView'

export const MyRouter = createBrowserRouter([
  {
    path: '/',
    element: <MainLayout />,
    errorElement: <RouteErrorBoundary />,
    children: [
      {
        path: '/v1/table-view',
        element: <TestTableView />,
      },
      {
        path: '/v1/dialogs-view',
        element: <TestDialogsView />,
      },
      {
        path: '/v1/loading-view',
        element: <LoadingView style={{ height: '100vh' }} />,
      },
      {
        path: '/v1/widgets',
        element: <TestWidgetsView />,
      },
      {
        path: '/v1/forms',
        element: <TestFormsView />,
      },
      {
        path: '/v1/routers',
        element: <TestRoutersView />,
      },
      {
        path: '*',
        element: <div>404 Not Found</div>,
      },
    ],
  },
])
