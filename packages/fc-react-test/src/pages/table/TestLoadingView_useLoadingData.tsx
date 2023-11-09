import React from 'react'
import { LoadingView, useLoadingData } from '@fangcha/react'
import { sleep } from '@fangcha/tools'

export const TestLoadingView_useLoadingData: React.FC = () => {
  const { loading, data: text } = useLoadingData(async () => {
    await sleep(1000)
    return 'Loaded.'
  })
  if (loading) {
    return <LoadingView />
  }
  return <div>{text}</div>
}
