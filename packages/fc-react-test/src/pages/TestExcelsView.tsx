import React, { useState } from 'react'
import { TypicalColumn, TypicalExcel } from '@fangcha/tools/src/excel'
import { FrontendFileReader } from '@fangcha/tools/src/frontend'
import { Button, message, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { FilePickerDialog } from '@fangcha/react'
import { ExcelPickButton, ExcelPreviewDialog } from '@fangcha/react-excel'

const { saveAs } = require('file-saver')

interface DataProps {
  aaa: any
  bbb: any
}

const columns: TypicalColumn<DataProps>[] = [
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
  const [version, setVersion] = useState(0)
  const [todoItems, setTodoItems] = useState<DataProps[]>([])
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
        <Button
          type={'primary'}
          onClick={async () => {
            const dialog = new FilePickerDialog({
              title: '导入 Excel',
            })
            dialog.show(async (file) => {
              const buffer = await FrontendFileReader.loadFileBuffer(file)
              await TypicalExcel.excelFromBuffer(
                buffer as any,
                columns.reduce((result, field) => {
                  result[field.columnName] = field.columnKey
                  return result
                }, {})
              )
                .then(async (excel) => {
                  message.success(`文件解析完成`)
                  new ExcelPreviewDialog({
                    columns: columns,
                    records: excel.records() as DataProps[],
                  }).show()
                })
                .catch((err) => {
                  message.error(`文件解析 / 上传失败`)
                  throw err
                })
            })
          }}
        >
          导入 Excel
        </Button>
        <ExcelPickButton>Custom Excel</ExcelPickButton>
      </Space>
    </div>
  )
}
