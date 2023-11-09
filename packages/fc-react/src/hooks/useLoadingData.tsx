import React, { useEffect, useState } from 'react'

type LoadData<T> = () => Promise<T>

export const useLoadingData = <T,>(loadData: LoadData<T>, deps?: any[]) => {
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<T>()
  useEffect(() => {
    setLoading(true)
    loadData()
      .then((data) => {
        setLoading(false)
        setData(data)
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
