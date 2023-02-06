import { QueryOptions } from 'sequelize'

export interface SequelizeProtocol {
  query(sql: string, options?: QueryOptions): Promise<any[]>
}
