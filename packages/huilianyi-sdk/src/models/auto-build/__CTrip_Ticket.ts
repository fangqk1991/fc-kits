import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'ticket_id',
  'order_type',
  'order_id',
  'info_id',
  'employee_id',
  'user_name',
  'user_oid',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'ctrip_status',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'ticket_id',
  'order_type',
  'order_id',
  'info_id',
  'employee_id',
  'user_name',
  'user_oid',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'ctrip_status',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'order_type',
  'order_id',
  'info_id',
  'employee_id',
  'user_name',
  'user_oid',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'ctrip_status',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'from_time',
  'to_time',
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
  'user_name',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'ticket_id',
  'order_id',
  'journey_no',
  'business_code',
  'traffic_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'user_name',
]

const dbOptions = {
  table: 'ctrip_ticket',
  primaryKey: ['ticket_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __CTrip_Ticket extends FeedBase {
  /**
   * @description [char(32)] order_type + order_id + info_id + user_oid(user_name) + traffic_code MD5
   */
  public ticketId!: string
  /**
   * @description [varchar(20)] HLY_OrderType
   */
  public orderType!: string
  /**
   * @description [bigint unsigned]
   */
  public orderId!: number
  /**
   * @description [varchar(36)]
   */
  public infoId!: string
  /**
   * @description [varchar(64)]
   */
  public employeeId!: string | null
  /**
   * @description [varchar(64)]
   */
  public userName!: string
  /**
   * @description [char(36)]
   */
  public userOid!: string
  /**
   * @description [varchar(16)]
   */
  public baseCity!: string
  /**
   * @description [varchar(16)]
   */
  public trafficCode!: string
  /**
   * @description [timestamp] 开始时间
   */
  public fromTime!: string | null
  /**
   * @description [timestamp] 结束时间
   */
  public toTime!: string | null
  /**
   * @description [varchar(16)]
   */
  public fromCity!: string
  /**
   * @description [varchar(16)]
   */
  public toCity!: string
  /**
   * @description [varchar(20)]
   */
  public journeyNo!: string
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string
  /**
   * @description [varchar(20)]
   */
  public ctripStatus!: string | null
  /**
   * @description [timestamp] 创建时间
   */
  public createTime!: string
  /**
   * @description [timestamp] 更新时间
   */
  public updateTime!: string

  protected static _staticDBOptions: DBProtocolV2
  protected static _staticDBObserver?: DBObserver

  public static setDatabase(database: FCDatabase, dbObserver?: DBObserver) {
    this.addStaticOptions({ database: database }, dbObserver)
  }

  public static setStaticProtocol(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static addStaticOptions(protocol: Partial<DBProtocolV2>, dbObserver?: DBObserver) {
    this._staticDBOptions = Object.assign({}, dbOptions, this._staticDBOptions, protocol) as DBProtocolV2
    this._staticDBObserver = dbObserver
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(_protocol: DBProtocolV2) {}

  public constructor() {
    super()
    this.setDBProtocolV2(this.constructor['_staticDBOptions'])
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.infoId = ''
    this.employeeId = null
    this.userName = ''
    this.userOid = ''
    this.baseCity = ''
    this.trafficCode = ''
    this.fromTime = null
    this.toTime = null
    this.journeyNo = ''
    this.businessCode = ''
    this.ctripStatus = null
  }

  public fc_propertyMapper() {
    return {
      ticketId: 'ticket_id',
      orderType: 'order_type',
      orderId: 'order_id',
      infoId: 'info_id',
      employeeId: 'employee_id',
      userName: 'user_name',
      userOid: 'user_oid',
      baseCity: 'base_city',
      trafficCode: 'traffic_code',
      fromTime: 'from_time',
      toTime: 'to_time',
      fromCity: 'from_city',
      toCity: 'to_city',
      journeyNo: 'journey_no',
      businessCode: 'business_code',
      ctripStatus: 'ctrip_status',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
