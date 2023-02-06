import { FCDatabase } from './FCDatabase'
import { Transaction } from 'sequelize'

export type NextAction = () => Promise<any>

export class TransactionRunner {
  private readonly _database: FCDatabase

  constructor(database: FCDatabase) {
    this._database = database
  }

  public async commit(handler: (transaction: Transaction) => Promise<NextAction[] | void>) {
    const transaction = await this._database._db().transaction()
    try {
      const actions = await handler(transaction)
      await transaction.commit()
      if (Array.isArray(actions)) {
        for (const callback of actions) {
          await callback()
        }
      }
    } catch (e: any) {
      console.error(`TransactionRunner: Catch an error "${e.message}", transaction rollback`)
      if (e.sql) {
        console.error(`Error SQL: ${e.sql}`)
      }
      console.error(e)
      await transaction.rollback()
      throw e
    }
  }
}
