import React from 'react'
import { Card, Space } from 'antd'
import { JsonPre, MyTagsPanel, useQueryParams } from '@fangcha/react'

export const TestWidgetsView: React.FC = () => {
  const { queryParams } = useQueryParams()
  return (
    <Space size={16}>
      <Card size={'small'} title='MyTagsPanel' style={{ width: 300 }}>
        <MyTagsPanel values={['abcdefg', 'hijklmn', 'opqrst', 'uvwxyz', '12345', '67890']} inline={true} thin={true} />
      </Card>
      <Card size={'small'} title='Query Params' style={{ width: 300 }}>
        <JsonPre value={queryParams} />
      </Card>
    </Space>
  )
}
