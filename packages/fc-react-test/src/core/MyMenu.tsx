import { CrownFilled } from '@ant-design/icons'
import { Route } from '@ant-design/pro-layout/es/typing'

export const MyMenu: Route = {
  path: '/',
  children: [
    {
      name: 'Components',
      icon: <CrownFilled />,
      children: [
        {
          path: '/v1/table-view',
          name: 'TableView',
        },
        {
          path: '/v1/dialogs-view',
          name: 'DialogsView',
        },
        {
          path: '/v1/loading-view',
          name: 'LoadingView',
        },
        {
          path: '/v1/widgets',
          name: 'Widgets',
        },
        {
          path: '/v1/forms',
          name: 'Forms',
        },
        {
          path: '/v1/routers',
          name: 'Routers',
        },
        {
          path: '/v1/excels',
          name: 'Excels',
        },
        {
          path: '/v1/text-editor',
          name: 'Text Editor',
        },
        {
          path: '/v1/echarts',
          name: 'ECharts',
        },
      ],
    },
  ],
}
