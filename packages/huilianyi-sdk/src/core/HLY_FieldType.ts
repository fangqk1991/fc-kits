export enum HLY_FieldType {
  TEXT = 'TEXT', // 文本
  CUSTOM_ENUMERATION = 'CUSTOM_ENUMERATION', // 值列表
  CUSTOM_ENUMERATION_MULTIPLE = 'CUSTOM_ENUMERATION_MULTIPLE', // 多选值列表
  HYPERLINK = 'HYPERLINK', // 超链接
  LONG = 'LONG', // 整数
  POSITIVE_INTEGER = 'POSITIVE_INTEGER', // 正整数
  DOUBLE = 'DOUBLE', // 浮点数
  DATE = 'DATE', // 日期
  START_DATE_AND_END_DATE = 'START_DATE_AND_END_DATE', // 开始结束日期
  DATETIME = 'DATETIME', // 时间
  MONTH = 'MONTH', // 月份
  BOOLEAN = 'BOOLEAN', // 普通开关
  PARTICIPANTS = 'PARTICIPANTS', // helios.participants 参与人
  PARTICIPANT = 'PARTICIPANT', // helios.participant 同行人
  LOCATION = 'LOCATION',
  GPS = 'GPS',
  ASSOCIATE_APPLICATION = 'ASSOCIATE_APPLICATION',
  ATTACHMENTS = 'ATTACHMENTS',
}

export enum HLY_FieldBusinessCode {
  'helios.number.of.accompanying' = 'helios.number.of.accompanying', // 陪同人员数量 LONG
  'helios.number.of.hospitalized' = 'helios.number.of.hospitalized', // 招待人员数量 LONG
  'helios.average.amount' = 'helios.average.amount', // 人均金额 DOUBLE
  'helios.departure.city' = 'helios.departure.city', // 出发城市 LOCATION
  'helios.destination.city' = 'helios.destination.city', // 到达城市 LOCATION
  'helios.city' = 'helios.city', // 城市 LOCATION
  'helios.departure.location' = 'helios.departure.location', // 出发地点 GPS
  'helios.destination.location' = 'helios.destination.location', // 到达地点 GPS
  'helios.location' = 'helios.location', // 地点 GPS
  'helios.dateCombined' = 'helios.dateCombined', // 开始结束日期 START_DATE_AND_END_DATE

  // 公司已付	COMPANY_PAID	helios.company.paid	2021-10-25
  // 报销类型	CUSTOM_ENUMERATION	helios.reimbursement.type	2021-10-25
  // 业务用途	CUSTOM_ENUMERATION	helios.business.type	2021-10-25

  'helios.associate.application' = 'helios.associate.application', // 关联申请单 ASSOCIATE_APPLICATION
  'helios.expense.attachments' = 'helios.expense.attachments' // 附件 ATTACHMENTS
}
