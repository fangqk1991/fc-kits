import * as Koa from 'koa'

type FullHandler = (ctx: Koa.Context, next: Koa.Next) => any
interface NestedHandler extends ReadonlyArray<Handler> {}
export type Handler = FullHandler | NestedHandler

export interface Spec {
  pre?: Handler

  method: string | string[]
  path: string | RegExp
  handler: Handler

  meta?: any
}

export const HttpMethodMap = {
  head: 'head',
  options: 'options',
  get: 'get',
  post: 'post',
  put: 'put',
  patch: 'patch',
  delete: 'delete',
}
