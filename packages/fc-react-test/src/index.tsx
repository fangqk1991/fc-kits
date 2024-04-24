import React from 'react'
import { ReactApp } from '@fangcha/react'
import { MainLayout } from './core/MainLayout'
import { TestTableView } from './pages/table/TestTableView'
import { TestDialogsView } from './pages/TestDialogsView'
import { TestLoadingView } from './pages/TestLoadingView'
import { TestWidgetsView } from './pages/TestWidgetsView'
import { TestFormsView } from './pages/TestFormsView'
import { TestRoutersView } from './pages/TestRoutersView'
import { TestExcelsView } from './pages/TestExcelsView'
import { TestTextEditor } from './pages/TestTextEditor'

new ReactApp({
  colorPrimary: 'rgb(221 115 164)',
  mainLayout: <MainLayout />,
  routes: [
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
      element: <TestLoadingView />,
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
      path: '/v1/excels',
      element: <TestExcelsView />,
    },
    {
      path: '/v1/text-editor',
      element: <TestTextEditor />,
    },
  ],
}).launch()
