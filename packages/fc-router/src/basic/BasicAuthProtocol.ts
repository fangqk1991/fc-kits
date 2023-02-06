import { OpenVisitor } from './OpenVisitor'

export interface BasicAuthProtocol<T = OpenVisitor> {
  findVisitor: (username: string, password: string) => T
}
