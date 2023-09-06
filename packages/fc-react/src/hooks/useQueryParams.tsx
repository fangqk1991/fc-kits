import React, { useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as qs from 'qs'

export function useQueryParams<T = {}>() {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = useMemo(() => {
    return qs.parse(window.location.search.replace(/^\?/, ''))
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
            ...qs.parse(window.location.search.replace(/^\?/, '')),
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
