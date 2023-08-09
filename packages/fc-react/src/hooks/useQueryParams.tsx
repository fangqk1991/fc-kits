import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as qs from 'qs'

export function useQueryParams<T = {}>() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = useMemo(() => {
    const params: any = {}
    for (const [key, value] of searchParams.entries()) {
      if (key in params) {
        if (!Array.isArray(params[key])) {
          params[key] = [params[key]]
        }
        params[key].push(value)
        continue
      }
      params[key] = value
    }
    return params
  }, [searchParams])

  return {
    queryParams: queryParams as T,
    setQueryParams: (params: Partial<T>) => {
      setSearchParams(
        qs.stringify(params, {
          arrayFormat: 'repeat',
        })
      )
    },
    updateQueryParams: (params: Partial<T>) => {
      Object.assign(queryParams, params)
      setSearchParams(
        qs.stringify(queryParams, {
          arrayFormat: 'repeat',
        })
      )
    },
  }
}
