import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { PageResult } from '@fangcha/tools'

interface DefaultSettings {
  pageNumber?: number
  pageSize?: number
  sortKey?: string
  sortDirection?: 'ascending' | 'descending'
}

interface RetainParams {
  _offset: number
  _length: number
  _sortKey: string
  _sortDirection: string
}

type TableViewProtocol<T = any> = {
  columns: ColumnsType<T>
  loadData?: (retainParams: Partial<RetainParams>) => Promise<PageResult<T>>
  loadOnePageItems?: (retainParams: Partial<RetainParams>) => Promise<T[]>
  defaultSettings?: DefaultSettings
  version?: number
  rowKey?: string | ((record: any, index?: number) => string)
}

export const TableView = <T,>(props: PropsWithChildren<TableViewProtocol<T>>) => {
  const defaultSettings = props.defaultSettings || {}
  defaultSettings.pageNumber = Number(defaultSettings.pageNumber || 0) || 1
  defaultSettings.pageSize = Number(defaultSettings.pageSize || 10)

  const [pageResult, setPageResult] = useState<PageResult>({
    offset: 0,
    length: 0,
    totalCount: 0,
    items: [],
  })
  const [curPageNum, setCurPageNum] = useState(defaultSettings.pageNumber)
  const [pageSize, setPageSize] = useState(defaultSettings.pageSize)
  const [loading, setLoading] = useState(true)

  const convertParams = (pageNumber: number, pageSize: number) => {
    const params: Partial<RetainParams> = {}
    if (pageNumber && pageSize) {
      params._offset = (pageNumber - 1) * pageSize
      params._length = pageSize
    }
    return params
  }

  useEffect(() => {
    if (props.loadOnePageItems) {
      setLoading(true)
      props
        .loadOnePageItems({
          ...convertParams(curPageNum, pageSize),
          _sortKey: defaultSettings.sortKey,
          _sortDirection: defaultSettings.sortDirection,
        })
        .then((items) => {
          setPageResult({
            offset: 0,
            length: items.length,
            totalCount: items.length,
            items: items,
          })
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          throw e
        })
    } else if (props.loadData) {
      setLoading(true)
      props
        .loadData({
          ...convertParams(curPageNum, pageSize),
          _sortKey: defaultSettings.sortKey,
          _sortDirection: defaultSettings.sortDirection,
        })
        .then((pageResult) => {
          setPageResult(pageResult)
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          throw e
        })
    }
  }, [curPageNum, pageSize, props.version, props.loadData, props.loadOnePageItems])

  return (
    <Table
      loading={loading}
      columns={props.columns}
      rowKey={props.rowKey}
      pagination={
        pageResult.totalCount > pageResult.length && {
          position: ['bottomRight'],
          showSizeChanger: true,
          onChange: (pageNumber, _pageSize) => {
            setCurPageNum(pageNumber)
          },
          onShowSizeChange: (_curPageNum, pageSize) => {
            setPageSize(pageSize)
          },
          defaultCurrent: curPageNum,
          pageSize: pageSize,
          total: pageResult.totalCount,
        }
      }
      dataSource={pageResult.items}
    />
  )
}
