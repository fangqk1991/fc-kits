import { TypicalColumn, TypicalExcel } from '@fangcha/excel'
import React from 'react'
import { Button, Space } from 'antd'
import { ExcelPickButton } from './ExcelPickButton'
import { DownloadOutlined } from '@ant-design/icons'
const { saveAs } = require('file-saver')

interface Props<T = any> {
  columns: TypicalColumn<T>[]
  tmplFileName?: string
  tmplDownloadBtnText?: string
  tmplDemoRecords?: any[]
  importBtnText?: string
  onPickRecords?: (records: T[]) => Promise<void> | void
}

export const HotExcelPanel = <T,>({
  columns,
  tmplFileName,
  tmplDemoRecords,
  tmplDownloadBtnText,
  importBtnText,
  onPickRecords,
}: Props<T>) => {
  return (
    <Space>
      <Button
        onClick={async () => {
          const excel = TypicalExcel.excelWithTypicalColumns(columns)
          if (tmplDemoRecords) {
            excel.addTypicalRowList(tmplDemoRecords)
          }
          const buffer = await excel.writeBuffer()
          const blob = new Blob([buffer], {
            type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          })
          saveAs(blob, tmplFileName || `templates.xlsx`)
        }}
      >
        {tmplDownloadBtnText || '下载模板'} <DownloadOutlined />
      </Button>
      <ExcelPickButton type={'primary'} columns={columns} onPickRecords={onPickRecords}>
        {importBtnText || '导入 Excel'}
      </ExcelPickButton>
    </Space>
  )
}
