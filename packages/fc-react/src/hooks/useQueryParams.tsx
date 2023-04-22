import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as qs from 'qs'

export function useQueryParams<T = {}>() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = useMemo(() => {
    const params = {}
    for (const [key, value] of searchParams.entries()) {
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
      setSearchParams(
        qs.stringify(
          {
            ...queryParams,
            ...params,
          },
          {
            arrayFormat: 'repeat',
          }
        )
      )
    },
  }
}
