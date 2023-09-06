import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import * as qs from 'qs'
import * as assert from 'assert'

export interface LinkProps {
  route: string
  params?: { [p: string]: string | number } | (string | number)[]
  queryParams?: { [p: string]: any }
  children?: ReactNode | undefined
}

export const RouterLink: React.FC<LinkProps> = (props) => {
  const params = props.params || {}
  const queryParams = props.queryParams || {}

  let pathname = ''
  if (!props.params) {
    pathname = props.route
  } else if (Array.isArray(params)) {
    let index = 0
    pathname = props.route.replace(/:([_a-zA-Z][\w-]*)/g, () => {
      return `${params[index++]}`
    })
    assert.ok(index === params.length)
  } else {
    pathname = props.route.replace(/:([_a-zA-Z][\w-]*)/g, (_, matchStr1) => {
      return `${params[matchStr1]}`
    })
  }
  const toPath = {
    pathname: pathname,
    search: qs.stringify(queryParams, {
      arrayFormat: 'repeat',
    }),
  }
  return <Link to={toPath}>{props.children}</Link>
}
