import React, { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import * as qs from 'qs'

export interface LinkProps {
  route: string
  params?: { [p: string]: string | number }
  queryParams?: { [p: string]: any }
  children?: ReactNode | undefined
}

export const RouterLink: React.FC<LinkProps> = (props) => {
  const params = props.params || {}
  const queryParams = props.queryParams || {}

  const toPath = {
    pathname: props.route.replace(/:([_a-zA-Z][\w-]*)/g, (_, matchStr1) => {
      return `${params[matchStr1]}`
    }),
    search: qs.stringify(queryParams, {
      arrayFormat: 'repeat',
    }),
  }
  return <Link to={toPath}>{props.children}</Link>
}
