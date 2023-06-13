import { FCDatabase } from 'fc-sql'
import { BasicAuthConfig } from '@fangcha/tools'
import { _HLY_Expense } from '../models/extensions/_HLY_Expense'
import { CustomRequestFollower } from '@fangcha/backend-kit'
import { HLY_BusinessDataProxy } from '../client/HLY_BusinessDataProxy'

interface Options {
  database: FCDatabase
  authConfig: BasicAuthConfig
}

export class HuilianyiSyncCore {
  public readonly options: Options
  public readonly database: FCDatabase

  public readonly dataProxy: HLY_BusinessDataProxy

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense

  constructor(options: Options) {
    this.options = options

    this.database = options.database

    this.dataProxy = new HLY_BusinessDataProxy(options.authConfig, CustomRequestFollower)

    class HLY_Expense extends _HLY_Expense {}
    HLY_Expense.addStaticOptions({
      database: options.database,
    })
    this.HLY_Expense = HLY_Expense
  }
}
