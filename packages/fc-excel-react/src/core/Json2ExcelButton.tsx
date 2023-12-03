import { FilePickerDialog } from '@fangcha/react'
import { TypicalColumn, TypicalExcel } from '@fangcha/excel'
import React from 'react'
import { Button, ButtonProps, message } from 'antd'
import { FrontendFileReader } from './FrontendFileReader'
import { ExcelPreviewDialog } from './ExcelPreviewDialog'
const { saveAs } = require('file-saver')

interface Props<T extends object = {}> {
  description?: React.ReactNode
  // onPickExcel?: (excel: TypicalExcel<T>) => Promise<void> | void
  filePickBtnText?: string
  previewSubmitBtnText?: string
}

export const Json2ExcelButton = <T extends object = {}>({
  description,
  // onPickExcel,
  ...props
}: ButtonProps & Props<T>) => {
  return (
    <Button
      onClick={async () => {
        const dialog = new FilePickerDialog({
          title: '选择 JSON 文件',
          description: description,
        })
        if (props.filePickBtnText) {
          dialog.okText = props.filePickBtnText
        }
        dialog.show(async (file) => {
          const buffer = await FrontendFileReader.loadFileBuffer(file)
          const rawText = new TextDecoder().decode(buffer)
          const items = JSON.parse(rawText) as any[]
          if (!Array.isArray(items) || items.length === 0) {
            message.error(`文本格式有误，需要为标准 JSON 字符串`)
            return
          }
          message.success(`文件解析成功`)

          const keys = Object.keys(items[0])
          const columns: TypicalColumn<any>[] = keys.map((key) => ({
            columnKey: key,
            columnName: key,
          }))

          const previewDialog = new ExcelPreviewDialog({
            columns: columns,
            records: items,
          })
          if (props.previewSubmitBtnText) {
            previewDialog.okText = props.previewSubmitBtnText
          }
          previewDialog.show(async () => {
            // if (onPickExcel) {
            //   await onPickExcel(excel)
            // }

            const excel = TypicalExcel.excelWithTypicalColumns(columns)
            excel.addTypicalRowList(items)

            const buffer = await excel.writeBuffer()
            const blob = new Blob([buffer], {
              type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
            })

            saveAs(blob, `${file.name}.xlsx`)
          })
        })
      }}
      {...props}
    >
      {props.children || 'JSON to Excel'}
    </Button>
  )
}
