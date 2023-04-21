import React from 'react'
import { Card, Space } from 'antd'
import { MyTagsPanel } from '@fangcha/react'

export const TestWidgetsView: React.FC = () => {
  return (
    <Space size={16}>
      <Card size={'small'} title='MyTagsPanel' style={{ width: 300 }}>
        <MyTagsPanel
          values={['abcdefg', 'hijklmn', 'opqrst', 'uvwxyz', '12345', '67890']}
          inline={true}
          thin={true}
        />
      </Card>
    </Space>
  )
}
