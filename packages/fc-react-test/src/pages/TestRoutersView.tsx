import React from 'react'
import { Button, Divider, Space } from 'antd'
import { JsonPre, useQueryParamsCtx } from '@fangcha/react'

export const TestRoutersView: React.FC = () => {
  const { queryParams, updateQueryParams } = useQueryParamsCtx()
  return (
    <div>
      <JsonPre value={queryParams} />
      <Divider />
      <Space>
        <Button
          onClick={() => {
            updateQueryParams({
              [`a_${Math.floor(Math.random() * 5)}`]: Math.random(),
            })
            updateQueryParams({
              [`b_${Math.floor(Math.random() * 10)}`]: Math.random(),
            })
          }}
        >
          Random
        </Button>
        <Button
          onClick={() => {
            updateQueryParams({
              [`a_0`]: undefined,
              [`a_1`]: undefined,
              [`a_2`]: undefined,
              [`a_3`]: undefined,
              [`a_4`]: undefined,
            })
          }}
        >
          Set a to undefined
        </Button>
      </Space>
    </div>
  )
}
