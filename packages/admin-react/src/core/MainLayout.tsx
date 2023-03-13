import { UserOutlined } from '@ant-design/icons'
import { PageContainer, ProLayout } from '@ant-design/pro-layout'
import React from 'react'
import { ConfigProvider, Dropdown } from 'antd'
import { useVisitorCtx } from '@fangcha/auth-react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Route } from '@ant-design/pro-layout/es/typing'

interface Props {
  menu: Route
  logoutUrl?: string
}

export const MainLayout: React.FC<Props> = ({ menu, logoutUrl = '/api-302/auth-sdk/v1/logout' }) => {
  const visitorCtx = useVisitorCtx()

  const { userInfo } = visitorCtx

  const location = useLocation()
  const navigate = useNavigate()

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: 'rgb(221 115 164)',
        },
      }}
    >
      <ProLayout
        logo={null}
        title='Tools'
        fixSiderbar={true}
        layout='mix'
        splitMenus={false}
        defaultCollapsed={false}
        route={menu}
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
            return (
              <Dropdown
                menu={{
                  items: [
                    {
                      key: 'logout',
                      label: 'Logout',
                      onClick: () => {
                        window.location.href = logoutUrl
                      },
                    },
                  ],
                }}
                trigger={['click']}
              >
                <div>
                  {avatar}
                  <span
                    style={{
                      marginInlineStart: 8,
                      userSelect: 'none',
                    }}
                  >
                    {userInfo.email}
                  </span>

                  {/*<Space>*/}
                  {/*  Click me*/}
                  {/*  <DownOutlined />*/}
                  {/*</Space>*/}
                </div>
              </Dropdown>

              // <div
              //   onClick={() => {
              //     console.info('onclick')
              //   }}
              // >
              // </div>
            )
          },
        }}
        // actionsRender 必须定义，否则会影响 avatarProps 的生效
        actionsRender={() => {
          return []
        }}
        menuItemRender={(item, dom) => (
          <div
            onClick={() => {
              navigate(item.path || '/')
            }}
          >
            {dom}
          </div>
        )}
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
  )
}
