import { Options, QueryTypes, Sequelize, Transaction } from 'sequelize'
import { SQLSearcher } from './SQLSearcher'
import { SQLAdder } from './SQLAdder'
import { SQLModifier } from './SQLModifier'
import { SQLRemover } from './SQLRemover'
import * as moment from 'moment'
import { TransactionRunner } from './TransactionRunner'
import { DBTableHandler } from './DBTableHandler'
import { QueryOptionsWithType } from 'sequelize/types/lib/query-interface'
import { SequelizeProtocol } from './SequelizeProtocol'
import * as assert from 'assert'

const _instanceMap: { [key: string]: any } = {}

interface SubDatabase<T extends SequelizeProtocol = Sequelize> {
  options?: Options
  entity?: T
}

export class FCDatabase<T extends SequelizeProtocol = Sequelize> {
  private __subDatabaseMap: { [dbKey: string]: SubDatabase<T> } = {
    _default: {},
  }
  private __curDbKey = '_default'

  public static instanceWithName<T extends SequelizeProtocol = Sequelize>(name: string): FCDatabase<T> {
    let obj = null
    if (name in _instanceMap && _instanceMap[name] instanceof FCDatabase) {
      obj = _instanceMap[name]
    } else {
      obj = new this()
      _instanceMap[name] = obj
    }
    return obj
  }

  public static getInstance<T extends SequelizeProtocol = Sequelize>(): FCDatabase<T> {
    return (this as any).instanceWithName('default')
  }

  private __subDatabase(dbKey: string): SubDatabase<T> {
    if (!this.__subDatabaseMap[dbKey]) {
      this.__subDatabaseMap[dbKey] = {}
    }
    return this.__subDatabaseMap[dbKey]
  }

  public setCurDbKey(dbKey: string) {
    this.__curDbKey = dbKey
    return this
  }

  private __curDatabase() {
    return this.__subDatabase(this.__curDbKey)
  }

  public getSubDatabase(dbKey: string) {
    return this.__subDatabase(dbKey)
  }

  public checkSubDatabaseValid(dbKey: string) {
    return !!this.__subDatabase(dbKey).options
  }

  public init(options: Options, dbKey?: string) {
    dbKey = dbKey || this.__curDbKey
    this.__subDatabase(dbKey).options = options
    return this
  }

  /**
   * @deprecated
   */
  public setSequelizeProtocol(protocol: T, dbKey?: string) {
    dbKey = dbKey || this.__curDbKey
    this.__subDatabase(dbKey).entity = protocol
    return this
  }

  public dbName() {
    return this.__curDatabase().options!.database as string
  }

  public async query(
    query: string,
    replacements: (string | number | null)[] = [],
    transaction: Transaction | null = null
  ): Promise<{ [key: string]: any }[]> {
    const options: Partial<QueryOptionsWithType<QueryTypes>> = {
      replacements: replacements,
      type: QueryTypes.SELECT,
      raw: true,
    }
    if (transaction) {
      options.transaction = transaction
    }
    const items = (await this._db().query(query, options)) as any[]
    if (items.length > 0) {
      const remainKeyMap = Object.keys(items[0]).reduce((result: any, cur: string) => {
        result[cur] = true
        return result
      }, {})
      for (const item of items) {
        const keys = Object.keys(remainKeyMap)
        for (const key of keys) {
          if (Object.prototype.toString.call(item[key]) === '[object Date]') {
            const time = moment(item[key])
            item[key] = time.isValid() ? time.format() : null
          } else {
            if (item[key] !== null && item[key] !== undefined) {
              delete remainKeyMap[key]
            }
          }
        }
      }
    }
    return items as { [p: string]: number | string }[]
  }

  public async update(
    query: string,
    replacements: (string | number | null)[] = [],
    transaction: Transaction | null = null
  ): Promise<any> {
    const options: Partial<QueryOptionsWithType<QueryTypes>> = {
      replacements: replacements,
    }
    if (transaction) {
      options.transaction = transaction
    }
    return this._db().query(query, options)
  }

  public _db(): T {
    const database = this.__curDatabase()
    if (!database.entity) {
      assert.ok(!!database.options, `${this.__curDbKey}'s options uninitialized.`)
      database.entity = new Sequelize(database.options) as any as T
    }
    return database.entity!
  }

  public searcher() {
    return new SQLSearcher(this as any as FCDatabase)
  }

  public adder() {
    return new SQLAdder(this as any as FCDatabase)
  }

  public modifier() {
    return new SQLModifier(this as any as FCDatabase)
  }

  public remover() {
    return new SQLRemover(this as any as FCDatabase)
  }

  public tableHandler(tableName: string) {
    return new DBTableHandler(this as any as FCDatabase, tableName)
  }

  public createTransactionRunner(): TransactionRunner {
    return new TransactionRunner(this as any as FCDatabase)
  }

  public async timezone() {
    const result = await this.query(`SHOW VARIABLES LIKE "time_zone"`)
    return result[0]['Value']
  }

  public async ping() {
    const database = this.__curDatabase()
    await this.query('SELECT 1').catch((err) => {
      throw new Error(
        `[${this.__curDbKey}][${database.options?.username} -> ${database.options?.database}] ${err.message}`
      )
    })
    return 'PONG'
  }

  public async getTables() {
    const items = await this.query('SHOW TABLES')
    return items.map((item) => item[`Tables_in_${this.dbName()}`]) as string[]
  }
}
