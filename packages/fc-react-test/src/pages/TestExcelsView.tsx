import React from 'react'
import { TypicalColumn, TypicalExcel } from '@fangcha/tools/src/excel'
import { Button, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'

const { saveAs } = require('file-saver')

const columns: TypicalColumn<any>[] = [
  {
    columnKey: 'aaa',
    columnName: 'AAA',
  },
  {
    columnKey: 'bbb',
    columnName: 'BBB',
  },
]

export const TestExcelsView: React.FC = () => {
  return (
    <div>
      <Space>
        <Button
          onClick={async () => {
            const excel = TypicalExcel.excelWithTypicalColumns(columns)
            const buffer = await excel.writeBuffer()
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })
            saveAs(blob, `templates.xlsx`)
          }}
        >
          下载模板 <DownloadOutlined />
        </Button>
      </Space>
    </div>
  )
}
