import React from 'react'
import { Button, Result } from 'antd'
import { isRouteErrorResponse, useRouteError } from 'react-router-dom'

export const RouteErrorBoundary = () => {
  const error = useRouteError()
  let statusCode = 500
  let errorTitle = 'Error'
  let subTitle = ''
  if (isRouteErrorResponse(error)) {
    statusCode = error.status
    errorTitle = error.statusText
    subTitle = error.data
  }
  return (
    <Result
      status={statusCode as any}
      title={errorTitle}
      subTitle={subTitle || (error as any)?.message || ''}
      extra={
        <Button
          type='primary'
          onClick={() => {
            window.location.reload()
          }}
        >
          Refresh
        </Button>
      }
    />
  )
}
