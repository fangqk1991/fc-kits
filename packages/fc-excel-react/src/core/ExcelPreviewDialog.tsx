import React from 'react'
import { DialogProps, ReactDialog } from '@fangcha/react'
import { TypicalColumn } from '@fangcha/excel'
import { Table } from 'antd'

interface Props<T> extends DialogProps {
  columns: TypicalColumn<T>[]
  records: T[]
}

export class ExcelPreviewDialog<T extends object> extends ReactDialog<Props<T>, T[]> {
  title = '预览 Excel 数据'
  width = 1000

  public rawComponent(): React.FC<Props<T>> {
    return (props) => {
      props.context.handleResult = () => {
        return props.records
      }
      return (
        <Table
          size={'small'}
          columns={props.columns.map((column) => ({
            title: column.columnName,
            render: (item) => item[column.columnKey],
          }))}
          dataSource={props.records}
          pagination={false}
        />
      )
    }
  }
}
