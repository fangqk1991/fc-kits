import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'order_id',
  'order_type',
  'employee_id',
  'user_name',
  'order_status',
  'change_status',
  'journey_no',
  'business_code',
  'created_date',
  'extras_info',
  'is_locked',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'order_id',
  'order_type',
  'employee_id',
  'user_name',
  'order_status',
  'change_status',
  'journey_no',
  'business_code',
  'created_date',
  'extras_info',
  'is_locked',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'order_type',
  'employee_id',
  'user_name',
  'order_status',
  'change_status',
  'journey_no',
  'business_code',
  'created_date',
  'extras_info',
  'is_locked',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'created_date',
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
  'user_name',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'order_id',
  'journey_no',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'user_name',
]

const dbOptions = {
  table: 'ctrip_order',
  primaryKey: ['order_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __CTrip_Order extends FeedBase {
  /**
   * @description [bigint unsigned]
   */
  public orderId!: number
  /**
   * @description [varchar(20)] CTrip_OrderType
   */
  public orderType!: string | null
  /**
   * @description [varchar(64)]
   */
  public employeeId!: string | null
  /**
   * @description [varchar(64)]
   */
  public userName!: string
  /**
   * @description [varchar(20)]
   */
  public orderStatus!: string | null
  /**
   * @description [varchar(20)]
   */
  public changeStatus!: string | null
  /**
   * @description [varchar(20)]
   */
  public journeyNo!: string
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string
  /**
   * @description [timestamp]
   */
  public createdDate!: string | null
  /**
   * @description [mediumtext] 附加信息，空 | JSON 字符串
   */
  public extrasInfo!: string
  /**
   * @description [tinyint] 是否锁定
   */
  public isLocked!: number
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
    this.orderType = null
    this.employeeId = null
    this.userName = ''
    this.orderStatus = null
    this.changeStatus = null
    this.journeyNo = ''
    this.businessCode = ''
    this.createdDate = null
    this.extrasInfo = ''
    this.isLocked = 0
  }

  public fc_propertyMapper() {
    return {
      orderId: 'order_id',
      orderType: 'order_type',
      employeeId: 'employee_id',
      userName: 'user_name',
      orderStatus: 'order_status',
      changeStatus: 'change_status',
      journeyNo: 'journey_no',
      businessCode: 'business_code',
      createdDate: 'created_date',
      extrasInfo: 'extras_info',
      isLocked: 'is_locked',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
