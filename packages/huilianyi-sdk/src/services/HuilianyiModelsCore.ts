import { FCDatabase } from 'fc-sql'
import { _HLY_Expense } from '../models/extensions/_HLY_Expense'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'
import { _HLY_Department } from '../models/extensions/_HLY_Department'
import { _HLY_Invoice } from '../models/extensions/_HLY_Invoice'

export class HuilianyiModelsCore {
  public readonly database: FCDatabase

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense
  public readonly HLY_Travel!: { new (): _HLY_Travel } & typeof _HLY_Travel
  public readonly HLY_Invoice!: { new (): _HLY_Invoice } & typeof _HLY_Invoice
  public readonly HLY_Staff!: { new (): _HLY_Staff } & typeof _HLY_Staff
  public readonly HLY_Department!: { new (): _HLY_Department } & typeof _HLY_Department

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

    class HLY_Invoice extends _HLY_Invoice {}
    HLY_Invoice.addStaticOptions({
      database: database,
    })
    this.HLY_Invoice = HLY_Invoice

    class HLY_Staff extends _HLY_Staff {}
    HLY_Staff.addStaticOptions({
      database: database,
    })
    this.HLY_Staff = HLY_Staff

    class HLY_Department extends _HLY_Department {}
    HLY_Department.addStaticOptions({
      database: database,
    })
    this.HLY_Department = HLY_Department
  }
}
