import { TypicalColumn, TypicalExcel } from '@fangcha/tools/src/excel'
import React from 'react'
import { Button, Space } from 'antd'
import { ExcelPickButton } from './ExcelPickButton'
import { DownloadOutlined } from '@ant-design/icons'
const { saveAs } = require('file-saver')

interface Props {
  columns: TypicalColumn<any>[]
  tmplFileName?: string
  onPickRecords?: (records: any[]) => Promise<void> | void
}

export const HotExcelPanel: React.FC<Props> = ({ columns, tmplFileName, onPickRecords }) => {
  return (
    <Space>
      <Button
        onClick={async () => {
          const excel = TypicalExcel.excelWithTypicalColumns(columns)
          const buffer = await excel.writeBuffer()
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          saveAs(blob, tmplFileName || `templates.xlsx`)
        }}
      >
        下载模板 <DownloadOutlined />
      </Button>
      <ExcelPickButton type={'primary'} columns={columns} onPickRecords={onPickRecords}>
        导入 Excel
      </ExcelPickButton>
    </Space>
  )
}
