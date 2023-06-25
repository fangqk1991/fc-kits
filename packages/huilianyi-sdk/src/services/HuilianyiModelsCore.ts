import { FCDatabase } from 'fc-sql'
import { _HLY_Expense } from '../models/extensions/_HLY_Expense'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'

export class HuilianyiModelsCore {
  public readonly database: FCDatabase

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense
  public readonly HLY_Travel!: { new (): _HLY_Travel } & typeof _HLY_Travel
  public readonly HLY_Staff!: { new (): _HLY_Staff } & typeof _HLY_Staff

  constructor(database: FCDatabase) {
    this.database = database

    class HLY_Expense extends _HLY_Expense {}
    HLY_Expense.addStaticOptions({
      database: database,
    })
    this.HLY_Expense = HLY_Expense

    class HLY_Travel extends _HLY_Travel {}
    HLY_Travel.addStaticOptions({
      database: database,
    })
    this.HLY_Travel = HLY_Travel

    class HLY_Staff extends _HLY_Staff {}
    HLY_Staff.addStaticOptions({
      database: database,
    })
    this.HLY_Staff = HLY_Staff
  }
}
