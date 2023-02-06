import { Transaction } from 'fc-sql'
import { GeneralGroupApp } from './GeneralGroupApp'
import { _CommonGroup } from './models/extensions/_CommonGroup'
import { _CommonMember } from './models/extensions/_CommonMember'
import { _CommonPermission } from './models/extensions/_CommonPermission'
import { GroupLevel, GroupSpace } from './common/models'
const uuid = require('uuid/v4')

export class GroupBuilder {
  public readonly groupApp: GeneralGroupApp
  public readonly group: _CommonGroup<_CommonMember, _CommonPermission>
  public readonly operator: string

  constructor(groupApp: GeneralGroupApp, space: GroupSpace, operator: string) {
    this.groupApp = groupApp
    const group = new groupApp.CommonGroup()
    group.groupId = uuid()
    group.space = space
    group.groupLevel = GroupLevel.Protected
    this.group = group
    this.operator = operator
  }

  public setObjKey(objKey: string) {
    this.group.objKey = objKey
    return this
  }

  public setGroupLevel(groupLevel: GroupLevel) {
    this.group.groupLevel = groupLevel
    return this
  }

  public setName(name: string) {
    this.group.name = name
    return this
  }

  public setRemarks(remarks: string) {
    this.group.remarks = remarks
    return this
  }

  public async build(transaction?: Transaction) {
    const handler = async (transaction: Transaction) => {
      await this.group.addToDB(transaction)
      const member = new this.groupApp.CommonMember()
      member.groupId = this.group.groupId
      member.member = this.operator
      member.isAdmin = 1
      await member.strongAddToDB(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = this.groupApp.database.createTransactionRunner()
      await runner.commit(handler)
    }
    return this.group
  }
}
