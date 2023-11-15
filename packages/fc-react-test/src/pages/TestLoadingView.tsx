import React from 'react'
import { LoadingDialog, LoadingView, useQueryParams } from '@fangcha/react'
import { Button, Tabs } from 'antd'
import { TestLoadingView_useLoadingData } from './table/TestLoadingView_useLoadingData'

export const TestLoadingView: React.FC = () => {
  const { queryParams, updateQueryParams, setQueryParams } = useQueryParams<{
    keywords: string
    curTab: string
    [p: string]: any
  }>()

  return (
    <Tabs
      activeKey={queryParams.curTab || 'LoadingView'}
      onChange={(curTab) => updateQueryParams({ curTab: curTab })}
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
            <div>
              <Button
                onClick={() => {
                  LoadingDialog.show('Testing...')
                }}
              >
                LoadingDialog
              </Button>
            </div>
          ),
        },
      ]}
    />
  )
}
