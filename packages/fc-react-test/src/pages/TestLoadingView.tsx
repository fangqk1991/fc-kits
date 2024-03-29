import React from 'react'
import { LoadingDialog, LoadingView, useQueryParams } from '@fangcha/react'
import { Button, message, Space, Tabs } from 'antd'
import { TestLoadingView_useLoadingData } from './table/TestLoadingView_useLoadingData'
import { sleep } from '@fangcha/tools'

export const TestLoadingView: React.FC = () => {
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    keywords: string
    curTab: string
    [p: string]: any
  }>()

  return (
    <Tabs
      activeKey={queryParams.curTab || 'LoadingView'}
      onChange={(curTab) => updateQueryParams({ curTab: curTab }, false)}
      type='card'
      items={[
        {
          label: `LoadingView`,
          key: 'LoadingView',
          children: <LoadingView style={{ height: '300px' }} />,
        },
        {
          label: `useLoadingData`,
          key: 'useLoadingData',
          children: <TestLoadingView_useLoadingData />,
        },
        {
          label: `LoadingDialog`,
          key: 'LoadingDialog',
          children: (
            <Space>
              <Button
                onClick={async () => {
                  const dialog = LoadingDialog.show('Testing...')
                  await sleep(1000)
                  dialog.dismiss()
                }}
              >
                LoadingDialog.show
              </Button>
              <Button
                onClick={async () => {
                  const result = await LoadingDialog.execute({
                    handler: async (context) => {
                      const count = 10
                      await sleep(500)
                      for (let i = 1; i <= 10; ++i) {
                        context.addText(
                          <b style={{ color: 'red' }}>
                            {i} / {count}
                          </b>
                        )
                        await sleep(500)
                      }
                      context.setText(<Button onClick={() => context.dismiss()}>关闭</Button>, true)
                      return 'Pong'
                    },
                    message: 'Ping...',
                    manualDismiss: true,
                  })
                  message.success(result)
                }}
              >
                LoadingDialog.execute
              </Button>
            </Space>
          ),
        },
      ]}
    />
  )
}
