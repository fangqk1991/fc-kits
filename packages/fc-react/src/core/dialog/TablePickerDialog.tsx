import React, { useState } from 'react'
import { Table, TableProps } from 'antd'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props<T = any> extends DialogProps {
  dataList: T[]
  rowKey: string | ((record: T, index?: number) => string)
  // columns: ColumnsType<T>[]
  columns: any[]
  tableProps?: TableProps<any>
}

type TableRowSelection<T extends object = object> = TableProps<T>['rowSelection']

export class TablePickerDialog<T = any> extends ReactDialog<Props<T>, T[]> {
  title = '请选择'
  width = '800px'

  public rawComponent(): React.FC<Props<T>> {
    return (props) => {
      const [selectedValues, setSelectedValues] = useState<React.Key[]>([])
      props.context.handleResult = () => {
        const checkedMap = new Set(selectedValues)
        return props.dataList.filter((item) =>
          checkedMap.has(typeof props.rowKey === 'string' ? item[props.rowKey] : props.rowKey(item))
        )
      }
      return (
        <Table
          size={'small'}
          rowKey={props.rowKey}
          rowSelection={{
            selectedRowKeys: selectedValues,
            // selections: [
            //   {
            //     key: 'Random',
            //     text: 'Random',
            //     onSelect: (changeableRowKeys) => {
            //       console.info(changeableRowKeys)
            //       setSelectedValues(
            //         changeableRowKeys.filter(() => {
            //           return Math.random() >= 0.5
            //         })
            //       )
            //     },
            //   },
            // ],
            onChange: (newSelectedRowKeys: React.Key[]) => {
              // console.info('setSelectedValues changed: ', newSelectedRowKeys)
              setSelectedValues(newSelectedRowKeys)
            },
          }}
          pagination={false}
          {...(props.tableProps || {})}
          columns={props.columns as any}
          dataSource={props.dataList as any}
        />
      )
    }
  }
}
