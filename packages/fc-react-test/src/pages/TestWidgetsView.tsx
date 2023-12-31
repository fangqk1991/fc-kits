import React from 'react'
import { Button, Card, message, Space } from 'antd'
import { DraggableOptionsDialog, DraggableOptionsPanel, JsonPre, MyTagsPanel, useQueryParams } from '@fangcha/react'

export const TestWidgetsView: React.FC = () => {
  const { queryParams } = useQueryParams()
  return (
    <div>
      <Space size={16}>
        <Card size={'small'} title='MyTagsPanel' style={{ width: 300 }}>
          <MyTagsPanel
            values={['abcdefg', 'hijklmn', 'opqrst', 'uvwxyz', '12345', '67890']}
            inline={true}
            thin={true}
            onItemClick={(value, index) => {
              message.success(`value: ${value}, index: ${index}`)
            }}
          />
        </Card>
        <Card size={'small'} title='Query Params' style={{ width: 300 }}>
          <JsonPre value={queryParams} />
        </Card>
        <Card size={'small'} title='Draggable' style={{ width: 300 }}>
          <Button
            onClick={() => {
              const dialog = DraggableOptionsDialog.dialogWithOptions([
                {
                  label: 'A',
                  value: 'a',
                },
                {
                  label: 'B',
                  value: 'b',
                },
                {
                  label: 'C',
                  value: 'c',
                },
                {
                  label: 'D',
                  value: 'd',
                },
                {
                  label: 'E',
                  value: 'e',
                },
              ])
              dialog.show(async (options) => {
                message.success(`${options.map((item) => `${item.index}.${item.label}`).join('  ')}`)
              })
            }}
          >
            DraggableOptionsDialog
          </Button>
        </Card>
      </Space>
      <div style={{ width: '800px' }}>
        <DraggableOptionsPanel
          options={[
            {
              label: 'A',
              value: 'a',
            },
            {
              label: 'B',
              value: 'b',
            },
            {
              label: 'C',
              value: 'c',
            },
            {
              label: 'D',
              value: 'd',
            },
            {
              label: 'E',
              value: 'e',
            },
          ]}
        />
      </div>
    </div>
  )
}
