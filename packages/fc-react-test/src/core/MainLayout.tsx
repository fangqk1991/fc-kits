import { UserOutlined } from '@ant-design/icons'
import { PageContainer, ProLayout } from '@ant-design/pro-layout'
import React from 'react'
import { ConfigProvider } from 'antd'
import { MyMenu } from './MyMenu'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { QueryParamsProvider, RouterLink } from '@fangcha/react'

export const MainLayout: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()

  return (
    <QueryParamsProvider>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: 'rgb(221 115 164)',
          },
        }}
      >
        <ProLayout
          logo={null}
          title='React Tests'
          fixSiderbar={true}
          layout='mix'
          splitMenus={false}
          route={MyMenu}
          location={{
            pathname: location.pathname,
          }}
          onMenuHeaderClick={() => navigate('/')}
          menu={{
            type: 'sub',
            defaultOpenAll: true,
            ignoreFlatMenu: true,
          }}
          avatarProps={{
            icon: <UserOutlined />,
            render: (avatarProps, avatar) => {
              return <></>
            },
          }}
          // actionsRender 必须定义，否则会影响 avatarProps 的生效
          actionsRender={() => {
            return []
          }}
          menuItemRender={(item, dom) => <RouterLink route={item.path || '/'}>{dom}</RouterLink>}
        >
          <PageContainer
            header={{
              // title: '页面标题',
              // 隐藏面包屑
              breadcrumb: {},
            }}
          >
            <Outlet />
          </PageContainer>
        </ProLayout>
      </ConfigProvider>
    </QueryParamsProvider>
  )
}
