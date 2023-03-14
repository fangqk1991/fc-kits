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
      ],
    },
  ],
}
