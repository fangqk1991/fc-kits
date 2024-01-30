import React from 'react'
import { DialogProps, ReactDialog } from '@fangcha/react'
import { TypicalColumn } from '@fangcha/excel'
import { Table } from 'antd'

interface Props<T> extends DialogProps {
  columns: TypicalColumn<T>[]
  records: T[]
  previewLength?: number
}

interface Record<T = any> {
  index: number
  entity: T
}

export class ExcelPreviewDialog<T extends object> extends ReactDialog<Props<T>, T[]> {
  title = '预览 Excel 数据'
  width: string | number = '90%'

  public rawComponent(): React.FC<Props<T>> {
    return (props) => {
      const length = props.previewLength || 100
      const items = props.records.map(
        (record, index): Record => ({
          index: index + 1,
          entity: record,
        })
      )
      const visibleItems = items.slice(0, length - 1)
      if (items.length >= length) {
        if (items.length > length) {
          visibleItems.push({
            index: '...' as any,
            entity: props.columns.reduce((result, cur) => {
              result[cur.columnKey] = '...'
              return result
            }, {}),
          })
        }
        visibleItems.push(items[items.length - 1])
      }

      props.context.handleResult = () => {
        return props.records
      }
      return (
        <Table
          size={'small'}
          columns={[
            {
              title: '#',
              render: (item: Record<T>) => item.index,
            },
            ...props.columns.map((column) => ({
              title: column.columnName,
              render: (item: Record<T>) =>
                item.entity[column.columnKey] && typeof item.entity[column.columnKey] === 'object'
                  ? JSON.stringify(item.entity[column.columnKey])
                  : item.entity[column.columnKey],
            })),
          ]}
          dataSource={visibleItems}
          pagination={false}
          scroll={{
            x: 'max-content',
          }}
        />
      )
    }
  }
}
