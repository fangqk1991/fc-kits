import { FilePickerDialog } from '@fangcha/react'
import { TypicalColumn, TypicalExcel } from '@fangcha/excel'
import { ExcelPreviewDialog } from './ExcelPreviewDialog'
import React from 'react'
import { Button, ButtonProps, message } from 'antd'
import { FrontendFileReader } from './FrontendFileReader'

interface Props<T extends object = {}> {
  columns?: TypicalColumn<T>[]
  description?: React.ReactNode
  onPickExcel?: (excel: TypicalExcel<T>) => Promise<void> | void
}

export const ExcelPickButton = <T extends object = {}>({
  columns,
  description,
  onPickExcel,
  ...props
}: ButtonProps & Props<T>) => {
  return (
    <Button
      onClick={async () => {
        const dialog = new FilePickerDialog({
          title: '导入 Excel',
          description: description,
        })
        dialog.show(async (file) => {
          const buffer = await FrontendFileReader.loadFileBuffer(file)
          await TypicalExcel.excelFromBuffer<T>(
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
                records: excel.records(),
              }).show(async () => {
                if (onPickExcel) {
                  await onPickExcel(excel)
                }
              })
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
