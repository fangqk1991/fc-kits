import React, { useState } from 'react'
import { TypicalColumn, TypicalExcel } from '@fangcha/tools/src/excel'
import { FrontendFileReader } from '@fangcha/tools/src/frontend'
import { Button, Divider, message, Space } from 'antd'
import { DownloadOutlined } from '@ant-design/icons'
import { FilePickerDialog, TableView, TableViewColumn } from '@fangcha/react'
import { TestTableView_SomeData } from './table/TestTableView_Tools'

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
                  setTodoItems(excel.records() as DataProps[])
                  setVersion(version + 1)
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
      </Space>
      <Divider />
      <TableView
        version={version}
        rowKey={(item: TestTableView_SomeData) => {
          return item.uid
        }}
        columns={TableViewColumn.makeColumns<DataProps>(
          columns.map((column) => ({
            title: column.columnName,
            render: (item) => <span>{item[column.columnKey]}</span>,
          }))
        )}
        loadOnePageItems={async () => {
          return todoItems
        }}
      />
    </div>
  )
}
