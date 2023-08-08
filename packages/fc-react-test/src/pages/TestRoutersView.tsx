import React from 'react'
import { Button, Divider } from 'antd'
import { JsonPre, useQueryParams } from '@fangcha/react'

export const TestRoutersView: React.FC = () => {
  const { queryParams, updateQueryParams } = useQueryParams()
  return (
    <div>
      <JsonPre value={queryParams} />
      <Divider />
      <Button
        onClick={() => {
          updateQueryParams({
            [`a_${Math.floor(Math.random() * 10)}`]: Math.random(),
          })
          updateQueryParams({
            [`b_${Math.floor(Math.random() * 10)}`]: Math.random(),
          })
        }}
      >
        Random
      </Button>
    </div>
  )
}
