import React, { PropsWithChildren, useEffect, useState } from 'react'
import { Table } from 'antd'
import type { ColumnsType } from 'antd/es/table'
import { TableProps } from 'antd/es/table'
import { PageResult } from '@fangcha/tools'
import { useQueryParams } from '../hooks/useQueryParams'

interface DefaultSettings {
  pageNumber?: number
  pageSize?: number
  sortKey?: string
  sortDirection?: 'ascend' | 'descend' | 'ascending' | 'descending' | ''
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
  tableProps?: TableProps<any>
  reactiveQuery?: boolean
  namespace?: string
}

export const TableView = <T,>(props: PropsWithChildren<TableViewProtocol<T>>) => {
  const { queryParams, updateQueryParams } = useQueryParams<DefaultSettings>()

  const getTargetKey = (key: string) => {
    return props.namespace ? `${props.namespace}.${key}` : key
  }

  const defaultSettings: DefaultSettings = props.defaultSettings || {}
  if (props.reactiveQuery) {
    for (const key of ['pageNumber', 'pageSize', 'sortKey', 'sortDirection']) {
      const targetKey = getTargetKey(key)
      if (queryParams[targetKey]) {
        defaultSettings[key] = queryParams[targetKey]
      }
    }
  }
  defaultSettings.pageNumber = Number(defaultSettings.pageNumber || 0) || 1
  defaultSettings.pageSize = Number(defaultSettings.pageSize || 10)
  defaultSettings.sortKey = defaultSettings.sortKey || ''
  defaultSettings.sortDirection = defaultSettings.sortDirection || ''

  const [settings, setSettings] = useState(defaultSettings)

  const [pageResult, setPageResult] = useState<PageResult>({
    offset: 0,
    length: 0,
    totalCount: 0,
    items: [],
  })
  const [loading, setLoading] = useState(true)

  const getRetainedParams = () => {
    const pageNumber = settings.pageNumber
    const pageSize = settings.pageSize
    const params: Partial<RetainParams> = {}
    if (pageNumber && pageSize) {
      params._offset = (pageNumber - 1) * pageSize
      params._length = pageSize
    }
    if (settings.sortKey) {
      params._sortKey = settings.sortKey
      params._sortDirection = settings.sortDirection
    }
    if (params._sortDirection) {
      if (['ascend', 'descend'].includes(params._sortDirection)) {
        params._sortDirection = `${params._sortDirection}ing`
      }
    }
    return params
  }

  const updateSettings = (params: Partial<DefaultSettings>) => {
    setSettings({
      ...settings,
      ...params,
    })
    if (props.reactiveQuery) {
      updateQueryParams(
        ['pageNumber', 'pageSize', 'sortKey', 'sortDirection']
          .filter((key) => key in params)
          .reduce((result, key) => {
            result[getTargetKey(key)] = params[key]
            return result
          }, {})
      )
    }
  }

  const reloadData = () => {
    const retainedParams = getRetainedParams()
    if (props.loadOnePageItems) {
      setLoading(true)
      props
        .loadOnePageItems(retainedParams)
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
        .loadData(retainedParams)
        .then((pageResult) => {
          setPageResult(pageResult)
          setLoading(false)
        })
        .catch((e) => {
          setLoading(false)
          throw e
        })
    }
  }

  useEffect(() => {
    reloadData()
  }, [settings, props.version, props.loadData, props.loadOnePageItems])

  return (
    <Table
      loading={loading}
      columns={props.columns}
      rowKey={props.rowKey}
      scroll={{
        x: 'max-content',
        ...(props.tableProps?.scroll || {}),
      }}
      pagination={
        pageResult.totalCount > pageResult.length && {
          position: ['bottomRight'],
          showSizeChanger: true,
          // onChange: (pageNumber, pageSize) => {
          //   updateSettings({
          //     pageNumber: pageNumber,
          //     pageSize: pageSize,
          //   })
          // },
          current: settings.pageNumber,
          pageSize: settings.pageSize,
          total: pageResult.totalCount,
        }
      }
      dataSource={pageResult.items}
      {...(props.tableProps || {})}
      onChange={(pagination, filters, sorter, extra) => {
        const newParams: any = {}
        if (sorter) {
          Object.assign(newParams, {
            sortKey: sorter['columnKey'],
            sortDirection: sorter['order'],
          })
        }
        if (pagination) {
          Object.assign(newParams, {
            pageNumber: pagination.current,
            pageSize: pagination.pageSize,
          })
        }
        if (Object.keys(newParams).length > 0) {
          updateSettings(newParams)
        }
        if (props.tableProps && props.tableProps.onChange) {
          props.tableProps.onChange(pagination, filters, sorter, extra)
        }
      }}
    />
  )
}
