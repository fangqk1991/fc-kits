import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { _HLY_Expense } from '../models/extensions/_HLY_Expense'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiModelsCore {
  public readonly database: FCDatabase

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense

  constructor(database: FCDatabase) {
    this.database = database

    class HLY_Expense extends _HLY_Expense {}
    HLY_Expense.addStaticOptions({
      database: database,
    })
    this.HLY_Expense = HLY_Expense
  }
}
