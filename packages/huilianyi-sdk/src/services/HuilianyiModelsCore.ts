import { FCDatabase } from 'fc-sql'
import { _HLY_Expense } from '../models/extensions/_HLY_Expense'
import { _HLY_Travel } from '../models/extensions/_HLY_Travel'
import { _HLY_Staff } from '../models/extensions/_HLY_Staff'
import { _HLY_Department } from '../models/extensions/_HLY_Department'
import { _HLY_Invoice } from '../models/extensions/_HLY_Invoice'
import { _HLY_Config } from '../models/extensions/_HLY_Config'
import { _HLY_TravelAllowance } from '../models/extensions/_HLY_TravelAllowance'
import { _HLY_AllowanceSnapshot } from '../models/extensions/_HLY_AllowanceSnapshot'
import { _HLY_SnapshotLog } from '../models/extensions/_HLY_SnapshotLog'
import { _HLY_OrderFlight } from '../models/extensions/_HLY_OrderFlight'
import { _HLY_OrderTrain } from '../models/extensions/_HLY_OrderTrain'
import { _HLY_OrderHotel } from '../models/extensions/_HLY_OrderHotel'
import { _HLY_ExpenseApplication } from '../models/extensions/_HLY_ExpenseApplication'

export class HuilianyiModelsCore {
  public readonly database: FCDatabase

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense
  public readonly HLY_Travel!: { new (): _HLY_Travel } & typeof _HLY_Travel
  public readonly HLY_Invoice!: { new (): _HLY_Invoice } & typeof _HLY_Invoice
  public readonly HLY_Staff!: { new (): _HLY_Staff } & typeof _HLY_Staff
  public readonly HLY_Department!: { new (): _HLY_Department } & typeof _HLY_Department
  public readonly HLY_Config!: { new (): _HLY_Config } & typeof _HLY_Config
  public readonly HLY_TravelAllowance!: { new (): _HLY_TravelAllowance } & typeof _HLY_TravelAllowance
  public readonly HLY_AllowanceSnapshot!: { new (): _HLY_AllowanceSnapshot } & typeof _HLY_AllowanceSnapshot
  public readonly HLY_SnapshotLog!: { new (): _HLY_SnapshotLog } & typeof _HLY_SnapshotLog
  public readonly HLY_OrderFlight!: { new (): _HLY_OrderFlight } & typeof _HLY_OrderFlight
  public readonly HLY_OrderTrain!: { new (): _HLY_OrderTrain } & typeof _HLY_OrderTrain
  public readonly HLY_OrderHotel!: { new (): _HLY_OrderHotel } & typeof _HLY_OrderHotel

  public readonly HLY_ExpenseApplication!: { new (): _HLY_ExpenseApplication } & typeof _HLY_ExpenseApplication

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

    class HLY_Config extends _HLY_Config {}
    HLY_Config.addStaticOptions({
      database: database,
    })
    this.HLY_Config = HLY_Config

    class HLY_TravelAllowance extends _HLY_TravelAllowance {}
    HLY_TravelAllowance.addStaticOptions({
      database: database,
    })
    this.HLY_TravelAllowance = HLY_TravelAllowance

    class HLY_AllowanceSnapshot extends _HLY_AllowanceSnapshot {}
    HLY_AllowanceSnapshot.addStaticOptions({
      database: database,
    })
    this.HLY_AllowanceSnapshot = HLY_AllowanceSnapshot

    class HLY_SnapshotLog extends _HLY_SnapshotLog {}
    HLY_SnapshotLog.addStaticOptions({
      database: database,
    })
    this.HLY_SnapshotLog = HLY_SnapshotLog

    class HLY_OrderFlight extends _HLY_OrderFlight {}
    HLY_OrderFlight.addStaticOptions({
      database: database,
    })
    this.HLY_OrderFlight = HLY_OrderFlight

    class HLY_OrderTrain extends _HLY_OrderTrain {}
    HLY_OrderTrain.addStaticOptions({
      database: database,
    })
    this.HLY_OrderTrain = HLY_OrderTrain

    class HLY_OrderHotel extends _HLY_OrderHotel {}
    HLY_OrderHotel.addStaticOptions({
      database: database,
    })
    this.HLY_OrderHotel = HLY_OrderHotel

    class HLY_ExpenseApplication extends _HLY_ExpenseApplication {}
    HLY_ExpenseApplication.addStaticOptions({
      database: database,
    })
    this.HLY_ExpenseApplication = HLY_ExpenseApplication
  }
}
