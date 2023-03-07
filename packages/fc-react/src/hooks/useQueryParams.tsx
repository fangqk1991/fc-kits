import React from 'react'
import { useSearchParams } from 'react-router-dom'
import * as qs from 'qs'

export const useQueryParams = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const queryParams = {}
  for (const [key, value] of searchParams.entries()) {
    queryParams[key] = value
  }
  return {
    queryParams: queryParams,
    setQueryParams: (params: any) => {
      setSearchParams(
        qs.stringify(params, {
          arrayFormat: 'repeat',
        })
      )
    },
    updateQueryParams: (params: any) => {
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
