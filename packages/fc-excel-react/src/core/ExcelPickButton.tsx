import { FilePickerDialog } from '@fangcha/react'
import { TypicalColumn, TypicalExcel } from '@fangcha/excel'
import { ExcelPreviewDialog } from './ExcelPreviewDialog'
import React from 'react'
import { Button, ButtonProps, message } from 'antd'
import { FrontendFileReader } from './FrontendFileReader'

interface Props {
  columns?: TypicalColumn<any>[]
  onPickRecords?: (records: any[]) => Promise<void> | void
}

export const ExcelPickButton: React.FC<ButtonProps & Props> = ({ columns, onPickRecords, ...props }) => {
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
              }).show(async (records) => {
                if (onPickRecords) {
                  await onPickRecords(records)
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
