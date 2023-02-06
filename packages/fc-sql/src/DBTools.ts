import { DBProtocolV2, DBSpec } from './DBProtocol'
import { Transaction } from 'sequelize'

interface Params {
  [key: string]: number | string
}

/**
 * @description When a DBProtocol is defined, you can use DBTools for quick add/update/delete/search
 */
export class DBTools {
  private readonly _protocol: DBSpec
  public transaction!: Transaction

  constructor(protocol: DBProtocolV2 | DBSpec, transaction?: Transaction) {
    this._protocol = protocol instanceof DBSpec ? protocol : new DBSpec(protocol)
    if (transaction) {
      this.transaction = transaction
    }
  }

  async add(params: Params): Promise<number> {
    const performer = this.makeAdder(params)
    return performer.execute()
  }

  async weakAdd(params: Params) {
    const performer = this.makeAdder(params)
    performer.setFixedKey(this._protocol.primaryKey)
    performer.keepOldDataWhenDuplicate()
    await performer.execute()
  }

  async strongAdd(params: Params) {
    const performer = this.makeAdder(params)
    performer.useUpdateWhenDuplicate()
    await performer.execute()
  }

  async update(params: Params): Promise<void> {
    const performer = this.makeModifier(params)
    await performer.execute()
  }

  async delete(params: Params): Promise<void> {
    const performer = this.makeRemover(params)
    await performer.execute()
  }

  /**
   * @deprecated Please user searcher.setPageInfo.queryList / searcher.setLimitInfo.queryList instead.
   */
  async fetchList(params: Params = {}, page: number = 0, length: number = 20): Promise<{ [key: string]: any }[]> {
    const builder = this.makeSearcher(params)
    builder.setPageInfo(page, length)
    return builder.queryList()
  }

  /**
   * @deprecated Please user searcher.queryCount instead.
   */
  async fetchCount(params: Params = {}): Promise<number> {
    const builder = this.makeSearcher(params)
    return builder.queryCount()
  }

  /**
   * @deprecated Please user searcher.querySingle instead.
   */
  async searchSingle(params: Params): Promise<undefined | {}> {
    const builder = this.makeSearcher(params)
    builder.setLimitInfo(0, 1)
    return builder.querySingle()
  }

  public makeAdder(params: Params) {
    const protocol = this._protocol
    const builder = protocol.database.adder()
    builder.transaction = this.transaction
    builder.setTable(protocol.table)
    protocol.insertableCols().forEach((col) => {
      const value = col in params ? params[col] : null
      if (this._protocol.checkTimestampKey(col)) {
        builder.insertKVForTimestamp(col, value)
      } else {
        builder.insertKV(col, value)
      }
    })
    return builder
  }

  public makeModifier(params: Params) {
    const protocol = this._protocol
    const builder = protocol.database.modifier()
    builder.transaction = this.transaction
    builder.setTable(protocol.table)
    protocol.primaryKeys().forEach((key) => {
      builder.checkPrimaryKey(params, key)
      delete params[key]
    })
    protocol.modifiableCols().forEach((col) => {
      if (col in params) {
        if (this._protocol.checkTimestampKey(col)) {
          builder.updateKVForTimestamp(col, params[col])
        } else {
          builder.updateKV(col, params[col])
        }
      }
    })
    return builder
  }

  public makeRemover(params: Params) {
    const protocol = this._protocol
    const builder = protocol.database.remover()
    builder.transaction = this.transaction
    builder.setTable(protocol.table)
    protocol.primaryKeys().forEach((key) => {
      builder.checkPrimaryKey(params, key)
    })
    return builder
  }

  public makeSearcher(params: Params = {}) {
    const protocol = this._protocol
    const builder = protocol.database.searcher()
    builder.transaction = this.transaction
    builder.setTable(protocol.table)
    protocol.cols().forEach((col) => {
      builder.addColumn(col)
    })
    Object.keys(params).forEach((key) => {
      builder.addConditionKV(key, params[key])
    })
    return builder
  }
}
