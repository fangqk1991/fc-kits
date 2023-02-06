export * from './SwaggerBuilder'
export * from './SpecFactory'
export * from './SwaggerDocItem'
export * from './RouterApp'

declare module 'koa' {
  interface Request {
    body?: any
    params: { [key: string]: string }
  }
}
