import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'ticket_id',
  'order_type',
  'order_id',
  'order_oid',
  'user_oid',
  'employee_id',
  'user_name',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'hly_code',
  'custom_code',
  'is_valid',
  'ctrip_valid',
  'ctrip_status',
  'custom_valid',
  'use_for_allowance',
  'in_closed_loop',
  'is_editable',
  'is_dummy',
  'remarks',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'ticket_id',
  'order_type',
  'order_id',
  'order_oid',
  'user_oid',
  'employee_id',
  'user_name',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'hly_code',
  'custom_code',
  'is_valid',
  'ctrip_valid',
  'ctrip_status',
  'custom_valid',
  'use_for_allowance',
  'in_closed_loop',
  'is_editable',
  'is_dummy',
  'remarks',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'order_type',
  'order_id',
  'order_oid',
  'user_oid',
  'employee_id',
  'user_name',
  'base_city',
  'traffic_code',
  'from_time',
  'to_time',
  'from_city',
  'to_city',
  'journey_no',
  'business_code',
  'hly_code',
  'custom_code',
  'is_valid',
  'ctrip_valid',
  'ctrip_status',
  'custom_valid',
  'use_for_allowance',
  'in_closed_loop',
  'is_editable',
  'is_dummy',
  'remarks',
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
  'order_oid',
  'journey_no',
  'business_code',
  'from_city',
  'to_city',
  'traffic_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'user_name',
]

const dbOptions = {
  table: 'hly_traffic_ticket',
  primaryKey: ['ticket_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __HLY_TrafficTicket extends FeedBase {
  /**
   * @description [char(32)] order_type + order_id + order_oid + user_oid(user_name) + traffic_code MD5
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
   * @description [char(36)]
   */
  public orderOid!: string
  /**
   * @description [char(36)]
   */
  public userOid!: string
  /**
   * @description [varchar(64)]
   */
  public employeeId!: string | null
  /**
   * @description [varchar(64)]
   */
  public userName!: string
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
   * @description [varchar(20)] 汇联易 Business Code
   */
  public hlyCode!: string
  /**
   * @description [varchar(20)] 手动绑定 Business Code
   */
  public customCode!: string
  /**
   * @description [tinyint] 是否有效
   */
  public isValid!: number
  /**
   * @description [tinyint] CTrip 订单是否有效
   */
  public ctripValid!: number
  /**
   * @description [varchar(20)]
   */
  public ctripStatus!: string | null
  /**
   * @description [tinyint] 自定义有效状态
   */
  public customValid!: number | null
  /**
   * @description [tinyint] 是否参与补贴计算
   */
  public useForAllowance!: number
  /**
   * @description [tinyint] 位于闭环行程中
   */
  public inClosedLoop!: number
  /**
   * @description [tinyint]
   */
  public isEditable!: number
  /**
   * @description [tinyint] 是否为虚拟票据
   */
  public isDummy!: number
  /**
   * @description [varchar(255)] 备注
   */
  public remarks!: string
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
    this.orderOid = ''
    this.userOid = ''
    this.employeeId = null
    this.userName = ''
    this.baseCity = ''
    this.trafficCode = ''
    this.fromTime = null
    this.toTime = null
    this.journeyNo = ''
    this.businessCode = ''
    this.hlyCode = ''
    this.customCode = ''
    this.isValid = 0
    this.ctripValid = 0
    this.ctripStatus = null
    this.customValid = null
    this.useForAllowance = 0
    this.inClosedLoop = 0
    this.isEditable = 0
    this.isDummy = 0
    this.remarks = ''
  }

  public fc_propertyMapper() {
    return {
      ticketId: 'ticket_id',
      orderType: 'order_type',
      orderId: 'order_id',
      orderOid: 'order_oid',
      userOid: 'user_oid',
      employeeId: 'employee_id',
      userName: 'user_name',
      baseCity: 'base_city',
      trafficCode: 'traffic_code',
      fromTime: 'from_time',
      toTime: 'to_time',
      fromCity: 'from_city',
      toCity: 'to_city',
      journeyNo: 'journey_no',
      businessCode: 'business_code',
      hlyCode: 'hly_code',
      customCode: 'custom_code',
      isValid: 'is_valid',
      ctripValid: 'ctrip_valid',
      ctripStatus: 'ctrip_status',
      customValid: 'custom_valid',
      useForAllowance: 'use_for_allowance',
      inClosedLoop: 'in_closed_loop',
      isEditable: 'is_editable',
      isDummy: 'is_dummy',
      remarks: 'remarks',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
