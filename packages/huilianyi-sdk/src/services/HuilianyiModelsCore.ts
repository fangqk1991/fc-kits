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
import { _HLY_PublicPayment } from '../models/extensions/_HLY_PublicPayment'
import { _HLY_StaffGroup } from '../models/extensions/_HLY_StaffGroup'
import { _HLY_StaffGroupMember } from '../models/extensions/_HLY_StaffGroupMember'
import { _HLY_AllowanceRule } from '../models/extensions/_HLY_AllowanceRule'
import { _HLY_TravelParticipant } from '../models/extensions/_HLY_TravelParticipant'
import { _HLY_TrafficTicket } from '../models/extensions/_HLY_TrafficTicket'
import { _CTrip_Order } from '../models/extensions/_CTrip_Order'
import { _Dummy_Travel } from '../models/extensions/_Dummy_Travel'
import { _Dummy_Ticket } from '../models/extensions/_Dummy_Ticket'

export class HuilianyiModelsCore {
  public readonly database: FCDatabase

  public readonly HLY_Expense!: { new (): _HLY_Expense } & typeof _HLY_Expense
  public readonly HLY_Travel!: { new (): _HLY_Travel } & typeof _HLY_Travel
  public readonly HLY_TravelParticipant!: { new (): _HLY_TravelParticipant } & typeof _HLY_TravelParticipant
  public readonly HLY_Invoice!: { new (): _HLY_Invoice } & typeof _HLY_Invoice
  public readonly HLY_Staff!: { new (): _HLY_Staff } & typeof _HLY_Staff
  public readonly HLY_StaffGroup!: { new (): _HLY_StaffGroup } & typeof _HLY_StaffGroup
  public readonly HLY_StaffGroupMember!: { new (): _HLY_StaffGroupMember } & typeof _HLY_StaffGroupMember
  public readonly HLY_Department!: { new (): _HLY_Department } & typeof _HLY_Department
  public readonly HLY_Config!: { new (): _HLY_Config } & typeof _HLY_Config
  public readonly HLY_TravelAllowance!: { new (): _HLY_TravelAllowance } & typeof _HLY_TravelAllowance
  public readonly HLY_AllowanceSnapshot!: { new (): _HLY_AllowanceSnapshot } & typeof _HLY_AllowanceSnapshot
  public readonly HLY_SnapshotLog!: { new (): _HLY_SnapshotLog } & typeof _HLY_SnapshotLog
  public readonly HLY_OrderFlight!: { new (): _HLY_OrderFlight } & typeof _HLY_OrderFlight
  public readonly HLY_OrderTrain!: { new (): _HLY_OrderTrain } & typeof _HLY_OrderTrain
  public readonly HLY_OrderHotel!: { new (): _HLY_OrderHotel } & typeof _HLY_OrderHotel
  public readonly HLY_PublicPayment!: { new (): _HLY_PublicPayment } & typeof _HLY_PublicPayment
  public readonly HLY_AllowanceRule!: { new (): _HLY_AllowanceRule } & typeof _HLY_AllowanceRule

  public readonly HLY_ExpenseApplication!: { new (): _HLY_ExpenseApplication } & typeof _HLY_ExpenseApplication
  public readonly HLY_TrafficTicket!: { new (): _HLY_TrafficTicket } & typeof _HLY_TrafficTicket

  public readonly CTrip_Order!: { new (): _CTrip_Order } & typeof _CTrip_Order
  public readonly Dummy_Travel!: { new (): _Dummy_Travel } & typeof _Dummy_Travel
  public readonly Dummy_Ticket!: { new (): _Dummy_Ticket } & typeof _Dummy_Ticket

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

    class HLY_TravelParticipant extends _HLY_TravelParticipant {}
    HLY_TravelParticipant.addStaticOptions({
      database: database,
    })
    this.HLY_TravelParticipant = HLY_TravelParticipant

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

    class HLY_StaffGroup extends _HLY_StaffGroup {}
    HLY_StaffGroup.addStaticOptions({
      database: database,
    })
    this.HLY_StaffGroup = HLY_StaffGroup

    class HLY_StaffGroupMember extends _HLY_StaffGroupMember {}
    HLY_StaffGroupMember.addStaticOptions({
      database: database,
    })
    this.HLY_StaffGroupMember = HLY_StaffGroupMember

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

    class HLY_PublicPayment extends _HLY_PublicPayment {}
    HLY_PublicPayment.addStaticOptions({
      database: database,
    })
    this.HLY_PublicPayment = HLY_PublicPayment

    class HLY_AllowanceRule extends _HLY_AllowanceRule {}
    HLY_AllowanceRule.addStaticOptions({
      database: database,
    })
    this.HLY_AllowanceRule = HLY_AllowanceRule

    class HLY_TrafficTicket extends _HLY_TrafficTicket {}
    HLY_TrafficTicket.addStaticOptions({
      database: database,
    })
    this.HLY_TrafficTicket = HLY_TrafficTicket

    class CTrip_Order extends _CTrip_Order {}
    CTrip_Order.addStaticOptions({
      database: database,
    })
    this.CTrip_Order = CTrip_Order

    class Dummy_Travel extends _Dummy_Travel {}
    Dummy_Travel.addStaticOptions({
      database: database,
    })
    this.Dummy_Travel = Dummy_Travel

    class Dummy_Ticket extends _Dummy_Ticket {}
    Dummy_Ticket.addStaticOptions({
      database: database,
    })
    this.Dummy_Ticket = Dummy_Ticket
  }
}
