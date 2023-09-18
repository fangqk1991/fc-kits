import { DBObserver, FeedBase } from 'fc-feed'
import { DBProtocolV2, FCDatabase } from 'fc-sql'

const _cols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
  'special_key',
  'applicant_oid',
  'applicant_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'version',
  'travel_status',
  'ticket_id_list_str',
  'remarks',
  'create_time',
  'update_time',
]
const _insertableCols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
  'special_key',
  'applicant_oid',
  'applicant_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'version',
  'travel_status',
  'ticket_id_list_str',
  'remarks',
]
const _modifiableCols: string[] = [
  // prettier-ignore
  'business_code',
  'applicant_oid',
  'applicant_name',
  'submitted_by',
  'title',
  'start_time',
  'end_time',
  'version',
  'travel_status',
  'ticket_id_list_str',
  'remarks',
]

const _timestampTypeCols: string[] = [
  // prettier-ignore
  'start_time',
  'end_time',
  'create_time',
  'update_time',
]
const _gbkCols: string[] = [
  // prettier-ignore
  'applicant_name',
]
const _exactSearchCols: string[] = [
  // prettier-ignore
  'hly_id',
  'business_code',
]
const _fuzzySearchCols: string[] = [
  // prettier-ignore
  'applicant_name',
]

const dbOptions = {
  table: 'dummy_travel',
  primaryKey: ['hly_id'],
  cols: _cols,
  insertableCols: _insertableCols,
  modifiableCols: _modifiableCols,
  timestampTypeCols: _timestampTypeCols,
  gbkCols: _gbkCols,
  exactSearchCols: _exactSearchCols,
  fuzzySearchCols: _fuzzySearchCols,
}

export default class __Dummy_Travel extends FeedBase {
  /**
   * @description [bigint unsigned]
   */
  public hlyId!: number
  /**
   * @description [varchar(20)]
   */
  public businessCode!: string
  /**
   * @description [char(32)] Special Hash
   */
  public specialKey!: string | null
  /**
   * @description [char(36)]
   */
  public applicantOid!: string | null
  /**
   * @description [text]
   */
  public applicantName!: string
  /**
   * @description [char(36)]
   */
  public submittedBy!: string | null
  /**
   * @description [text]
   */
  public title!: string
  /**
   * @description [timestamp] 开始时间
   */
  public startTime!: string | null
  /**
   * @description [timestamp] 结束时间
   */
  public endTime!: string | null
  /**
   * @description [int] 版本号
   */
  public version!: number
  /**
   * @description [int] HLY_TravelStatus
   */
  public travelStatus!: number | null
  /**
   * @description [text]
   */
  public ticketIdListStr!: string
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
    this._reloadOnAdded = true
    this._reloadOnUpdated = true
    if (this.constructor['_staticDBObserver']) {
      this.dbObserver = this.constructor['_staticDBObserver']
    }
  }

  public fc_defaultInit() {
    // This function is invoked by constructor of FCModel
    this.specialKey = null
    this.applicantOid = null
    this.applicantName = ''
    this.submittedBy = null
    this.title = ''
    this.startTime = null
    this.endTime = null
    this.version = 0
    this.travelStatus = null
    this.ticketIdListStr = ''
    this.remarks = ''
  }

  public fc_propertyMapper() {
    return {
      hlyId: 'hly_id',
      businessCode: 'business_code',
      specialKey: 'special_key',
      applicantOid: 'applicant_oid',
      applicantName: 'applicant_name',
      submittedBy: 'submitted_by',
      title: 'title',
      startTime: 'start_time',
      endTime: 'end_time',
      version: 'version',
      travelStatus: 'travel_status',
      ticketIdListStr: 'ticket_id_list_str',
      remarks: 'remarks',
      createTime: 'create_time',
      updateTime: 'update_time',
    }
  }
}
