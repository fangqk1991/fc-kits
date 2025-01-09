import { FilePickerDialog } from '@fangcha/react'
import { ExcelParseOptions, TypicalColumn, TypicalExcel } from '@fangcha/excel'
import { ExcelPreviewDialog } from './ExcelPreviewDialog'
import React from 'react'
import { Button, ButtonProps, message } from 'antd'
import { FrontendFileReader } from './FrontendFileReader'

interface Props<T extends object = {}> {
  skipPreview?: boolean
  columns?: TypicalColumn<T>[]
  description?: React.ReactNode
  onPickExcel?: (excel: TypicalExcel<T>) => Promise<void> | void
  filePickBtnText?: React.ReactNode
  previewSubmitBtnText?: React.ReactNode
  excelOptions?: ExcelParseOptions
  text2ValueTransform?: (text: string, curKey: string) => any
}

export const ExcelPickButton = <T extends object = {}>({
  columns,
  description,
  onPickExcel,
  skipPreview,
  text2ValueTransform,
  filePickBtnText,
  previewSubmitBtnText,
  excelOptions = {},
  ...props
}: ButtonProps & Props<T>) => {
  return (
    <Button
      onClick={async () => {
        const dialog = new FilePickerDialog({
          title: '选择 Excel',
          description: description,
        })
        if (filePickBtnText) {
          dialog.okText = filePickBtnText
        }
        dialog.show(async (file) => {
          const buffer = await FrontendFileReader.loadFileBuffer(file)
          await TypicalExcel.excelFromBuffer<T>(buffer as any, {
            name2keyMap: columns
              ? columns.reduce((result, field) => {
                  result[field.columnName] = field.columnKey
                  return result
                }, {})
              : {},
            text2ValueTransform: text2ValueTransform,
            ...excelOptions,
          })
            .then(async (excel) => {
              message.success(`文件解析成功`)
              excel.fileName = file.name || ''

              if (skipPreview) {
                if (onPickExcel) {
                  await onPickExcel(excel)
                }
              } else {
                const previewDialog = new ExcelPreviewDialog({
                  columns:
                    columns ||
                    excel.columnKeys.map((key) => ({
                      columnKey: key,
                      columnName: key,
                    })),
                  records: excel.records(),
                })
                if (previewSubmitBtnText) {
                  previewDialog.okText = previewSubmitBtnText
                }
                previewDialog.show(async () => {
                  if (onPickExcel) {
                    await onPickExcel(excel)
                  }
                })
              }
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
