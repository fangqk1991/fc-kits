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

  const defaultSettings: DefaultSettings = props.defaultSettings || {}
  if (props.reactiveQuery) {
    for (const key of ['pageNumber', 'pageSize', 'sortKey', 'sortDirection']) {
      if (queryParams[key]) {
        defaultSettings[key] = queryParams[key]
      }
    }
  }
  defaultSettings.pageNumber = Number(defaultSettings.pageNumber || 0) || 1
  defaultSettings.pageSize = Number(defaultSettings.pageSize || 10)
  defaultSettings.sortKey = defaultSettings.sortKey || ''
  defaultSettings.sortDirection = defaultSettings.sortDirection || ''
  if (['ascend', 'descend'].includes(defaultSettings.sortDirection)) {
    defaultSettings.sortDirection = `${defaultSettings.sortDirection}ing` as any
  }

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
    return params
  }

  const updateSettings = (params: Partial<DefaultSettings>) => {
    const newParams = {
      ...settings,
      ...params,
    }
    if (props.reactiveQuery) {
      updateQueryParams(newParams)
    }
    setSettings(newParams)
  }

  // const getTargetKey = (key: string) => {
  //   return props.namespace ? `${props.namespace}.${key}` : key
  // }

  // const updateQuery = () => {
  //   if (!props.reactiveQuery) {
  //     return
  //   }
  //   const retainQueryParams: DefaultSettings = {
  //     [getTargetKey('pageNumber')]: this.pageInfo.pageNumber,
  //     [getTargetKey('pageSize')]: this.pageInfo.pageSize,
  //     [getTargetKey('sortKey')]: this.orderRule.prop,
  //     [getTargetKey('sortDirection')]: this.orderRule.order,
  //   }
  //   const params = this.delegate.reactiveQueryParams
  //     ? this.delegate.reactiveQueryParams(retainQueryParams)
  //     : retainQueryParams
  //   let queryParams = Object.assign({}, this.$route?.query || {})
  //
  //   Object.keys(params).forEach((key) => {
  //     if (params[key] !== undefined || params[key] !== null) {
  //       queryParams[key] = params[key]
  //     }
  //     if (typeof queryParams[key] === 'number') {
  //       queryParams[key] = `${queryParams[key]}`
  //     }
  //   })
  //
  //   if (this.trimParams) {
  //     queryParams = trimParams(queryParams)
  //   }
  //
  //   for (const queryKey of Object.keys(queryParams)) {
  //     for (const forbiddenWord of this.forbiddenQueryWords) {
  //       if (typeof queryParams[queryKey] === 'string' && queryParams[queryKey].includes(forbiddenWord)) {
  //         delete queryParams[queryKey]
  //         break
  //       }
  //     }
  //   }
  //   const defaultSettings = this.getDefaultSettings()
  //   for (const key of ['pageNumber', 'pageSize', 'sortKey', 'sortDirection']) {
  //     if (queryParams[key] === `${defaultSettings[key]}`) {
  //       delete queryParams[key]
  //     }
  //   }
  //   if (this.$route && !DiffMapper.checkEquals(this.$route.query, queryParams)) {
  //     this.$router.replace({
  //       path: this.$route.path,
  //       query: queryParams,
  //     })
  //   }
  // }

  useEffect(() => {
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
          onChange: (pageNumber, pageSize) => {
            updateSettings({
              pageNumber: pageNumber,
              pageSize: pageSize,
            })
          },
          current: settings.pageNumber,
          pageSize: settings.pageSize,
          total: pageResult.totalCount,
        }
      }
      dataSource={pageResult.items}
      {...(props.tableProps || {})}
    />
  )
}
