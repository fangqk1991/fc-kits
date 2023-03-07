import React, { useEffect, useState } from 'react'
import { AxiosBuilder } from '@fangcha/app-request'

export function useRequest<T = any>(request: AxiosBuilder, deps: any[] = []): [T, boolean] {
  const [response, setResponse] = useState(null)
  const [isLoading, setLoading] = useState(true)

  useEffect(() => {
    request
      .quickSend()
      .then((response) => {
        setResponse(response)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        throw err
      })
  }, deps)

  return [response as T, isLoading]
}
