import React, { useContext, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import * as qs from 'qs'

type Params = { [p: string]: any }

interface Context<T = Params> {
  queryParams: T
  updateQueryParams: (params: Partial<T>) => void
  setQueryParams: (params: Partial<T>) => void
}

export const QueryParamsContext = React.createContext<Context>(null as any)

export const useQueryParamsCtx: <T = Params>() => Context<T> = <T,>() => {
  return useContext(QueryParamsContext) as any as Context<T>
}

export const QueryParamsProvider = ({ children }: React.ComponentProps<any>) => {
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

  const context: Context = {
    queryParams: queryParams,
    setQueryParams: (params) => {
      setSearchParams(
        qs.stringify(params, {
          arrayFormat: 'repeat',
        })
      )
    },
    updateQueryParams: (params) => {
      Object.assign(queryParams, params)
      setSearchParams(
        qs.stringify(queryParams, {
          arrayFormat: 'repeat',
        })
      )
    },
  }

  return <QueryParamsContext.Provider value={context}>{children}</QueryParamsContext.Provider>
}
