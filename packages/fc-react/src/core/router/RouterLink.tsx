import React, { ReactNode } from 'react'
import { Link, LinkProps } from 'react-router-dom'
import * as qs from 'qs'
import * as assert from 'assert'

interface Props extends Partial<LinkProps> {
  route: string
  params?: { [p: string]: string | number } | (string | number)[]
  queryParams?: { [p: string]: any }
  children?: ReactNode | undefined
}

export const RouterLink: React.FC<Props> = ({ route, params, queryParams, children, ...props }) => {
  let pathname = ''
  if (!params) {
    pathname = route
  } else if (Array.isArray(params)) {
    let index = 0
    pathname = route.replace(/:([_a-zA-Z][\w-]*)/g, () => {
      return `${params[index++]}`
    })
    assert.ok(index === params.length)
  } else {
    pathname = route.replace(/:([_a-zA-Z][\w-]*)/g, (_, matchStr1) => {
      return `${params[matchStr1]}`
    })
  }
  const toPath = {
    pathname: pathname,
    search: qs.stringify(queryParams || {}, {
      arrayFormat: 'repeat',
    }),
  }
  return (
    <Link {...props} to={toPath}>
      {children}
    </Link>
  )
}
