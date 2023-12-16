import React, { useEffect, useState } from 'react'

type LoadData<T> = () => Promise<T>

export const useLoadingData = <T,>(loadData: LoadData<T>, deps?: any[]) => {
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<T>()
  useEffect(() => {
    setLoading(true)
    loadData()
      .then((data) => {
        setData(data)
        setLoading(false)
      })
      .catch((err) => {
        setLoading(false)
        throw err
      })
  }, [...(deps || [])])
  return {
    loading: loading,
    data: data as T,
  }
}
