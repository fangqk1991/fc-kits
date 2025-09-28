import React, { PropsWithChildren, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { TableProps } from 'antd/es/table'
import { TablePageOptions } from './TableParamsHelper'

type TableViewProtocol<T = any> = {
  columns: ColumnsType<T>

  items?: T[]
  pageResult?: {
    totalCount: number
    items: T[]
  }
  onParamsChanged?: (retainParams: Partial<TablePageOptions>) => void
  initialSettings?: TablePageOptions
  onDisplayItemsChanged?: (items: T[]) => void

  rowKey?: string | ((record: any, index?: number) => string)
  hidePagination?: boolean

  tableProps?: TableProps<any>
}

export const TableViewV2 = <T,>(props: PropsWithChildren<TableViewProtocol<T>>) => {
  if (!props.pageResult && !props.items) {
    throw new Error('At least one of items or pageResult must be defined.')
  }
  const items = props.items || props.pageResult?.items || []
  const totalCount = props.items?.length || props.pageResult?.totalCount || 0

  const [realSettings, setRealSettings] = useState(() => {
    const settings = {
      ...(props.initialSettings || {}),
    }
    settings.pageNumber = Number(settings.pageNumber || 0) || 1
    settings.pageSize = Number(settings.pageSize || 10)
    settings.sortKey = settings.sortKey || ''
    settings.sortDirection = settings.sortDirection || ''
    return settings
  })

  return (
    <Table
      columns={props.columns}
      rowKey={props.rowKey}
      scroll={{
        x: 'max-content',
        ...(props.tableProps?.scroll || {}),
      }}
      pagination={
        !props.hidePagination && {
          position: ['bottomRight'],
          showSizeChanger: true,
          // onChange: (pageNumber, pageSize) => {
          //   const newOptions = {
          //     ...realSettings,
          //     pageNumber: pageNumber,
          //     pageSize: pageSize,
          //   }
          //   setRealSettings(newOptions)
          //   const retainedParams = TableParamsHelper.extractDataParams(newOptions)
          //   props.onParamsChanged && props.onParamsChanged(retainedParams)
          // },
          // showTotal: props.showTotal ? (totalCount) => `Total: ${totalCount}` : undefined,
          showTotal: (totalCount) => `TOTAL: ${totalCount}`,
          current: realSettings.pageNumber,
          pageSize: realSettings.pageSize,
          total: totalCount,
        }
      }
      dataSource={items}
      {...(props.tableProps || {})}
      onChange={(pagination, filters, sorter, extra) => {
        const newOptions: any = { ...realSettings }
        if (sorter && sorter['columnKey'] && (realSettings.sortKey || sorter['order'])) {
          Object.assign(newOptions, {
            sortKey: sorter['columnKey'],
            sortDirection: sorter['order'],
          })
        }
        if (pagination) {
          Object.assign(newOptions, {
            pageNumber: pagination.current,
            pageSize: pagination.pageSize,
          })
        }
        setRealSettings(newOptions)

        props.onParamsChanged && props.onParamsChanged(newOptions)
        props.onDisplayItemsChanged && props.onDisplayItemsChanged(extra.currentDataSource)

        if (props.tableProps && props.tableProps.onChange) {
          props.tableProps.onChange(pagination, filters, sorter, extra)
        }
      }}
    />
  )
}
