import { FilePickerDialog } from '@fangcha/react'
import { TypicalColumn, TypicalExcel } from '@fangcha/tools/src/excel'
import { FrontendFileReader } from '@fangcha/tools/src/frontend'
import { ExcelPreviewDialog } from './ExcelPreviewDialog'
import React from 'react'
import { Button, ButtonProps, message } from 'antd'

interface Props {
  columns?: TypicalColumn<any>[]
}

export const ExcelPickButton: React.FC<ButtonProps & Props> = ({ columns, ...props }) => {
  return (
    <Button
      onClick={async () => {
        const dialog = new FilePickerDialog({
          title: '导入 Excel',
        })
        dialog.show(async (file) => {
          const buffer = await FrontendFileReader.loadFileBuffer(file)
          await TypicalExcel.excelFromBuffer(
            buffer as any,
            columns &&
              columns.reduce((result, field) => {
                result[field.columnName] = field.columnKey
                return result
              }, {})
          )
            .then(async (excel) => {
              message.success(`文件解析成功`)
              new ExcelPreviewDialog({
                columns:
                  columns ||
                  excel.columnKeys.map((key) => ({
                    columnKey: key,
                    columnName: key,
                  })),
                records: excel.records() as any[],
              }).show()
            })
            .catch((err) => {
              message.error(`文件解析失败`)
              throw err
            })
        })
      }}
      {...props}
    >
      {props.children || '导入 Excel'}
    </Button>
  )
}
