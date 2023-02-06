import __CommonGroup from '../auto-build/__CommonGroup'
import assert from '@fangcha/assert'
import { DBProtocolV2, FCDatabase, Transaction } from 'fc-sql'
import { _CommonMember } from './_CommonMember'
import { _CommonPermission } from './_CommonPermission'
import { FilterOptions } from 'fc-feed'
import { GroupLevel, GroupSpace, ScopeParams } from '../../common/models'
import { makeUUID } from '@fangcha/tools'

class CommonMemberDup extends _CommonMember {}
class CommonPermissionDup extends _CommonPermission {}

export class _CommonGroup<
  T_CommonMember extends _CommonMember = _CommonMember,
  T_CommonPermission extends _CommonPermission = _CommonPermission
> extends __CommonGroup {
  public static CommonMember: typeof _CommonMember = CommonMemberDup
  public static CommonPermission: typeof _CommonPermission = CommonPermissionDup

  public static setClass_CommonMember<T extends _CommonMember>(CommonMember: { new (): T }) {
    if (CommonMember) {
      this.CommonMember = CommonMember as any
    }
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static setClass_CommonPermission<T extends _CommonPermission>(CommonPermission: { new (): T }) {
    if (CommonPermission) {
      this.CommonPermission = CommonPermission as any
    }
    this._onStaticDBOptionsUpdate(this._staticDBOptions)
  }

  public static _onStaticDBOptionsUpdate(protocol: DBProtocolV2) {
    if (protocol) {
      const database = protocol.database as FCDatabase
      this.CommonMember.setDatabase(database)
      this.CommonPermission.setDatabase(database)
    }
  }

  public constructor() {
    super()
  }

  public async updateInfo(options: any) {
    this.fc_edit()
    if (options.name) {
      this.name = options.name
    }
    const runner = this.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await this.updateToDB()
      await this.increaseVersion(transaction)
    })
  }

  public async updatePermissions(scopeParams: ScopeParams) {
    const CommonPermission = this.getClass().CommonPermission
    const permissions = await this.getPermissions()
    const runner = this.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const permission of permissions) {
        await permission.deleteFromDB(transaction)
      }
      for (const scope of Object.keys(scopeParams)) {
        for (const permissionKey of scopeParams[scope]) {
          const permission = new CommonPermission()
          permission.groupId = this.groupId
          permission.scope = scope
          permission.permission = permissionKey
          await permission.addToDB(transaction)
        }
      }
      await this.increaseVersion(transaction)
    })
  }

  public getClass() {
    return this.constructor as typeof _CommonGroup
  }

  public async getMembers() {
    return (await this.getClass().CommonMember.membersForGroupId(this.groupId)) as T_CommonMember[]
  }

  public async getPermissions() {
    return (await this.getClass().CommonPermission.permissionsForGroupId(this.groupId)) as T_CommonPermission[]
  }

  public async findMember(email: string) {
    return (await this.getClass().CommonMember.findOne({
      group_id: this.groupId,
      member: email,
    })) as T_CommonMember
  }

  public async addMultipleMembers(emailList: string[]) {
    const CommonMember = this.getClass().CommonMember
    const runner = this.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      for (const email of emailList) {
        const member = new CommonMember()
        member.groupId = this.groupId
        member.member = email
        await member.weakAddToDB(transaction)
      }
      await this.increaseVersion(transaction)
    })
  }

  public async removeMember(email: string) {
    const member = (await this.findMember(email)) as T_CommonMember
    assert.ok(!!member, '成员不存在')
    const runner = this.dbSpec().database.createTransactionRunner()
    await runner.commit(async (transaction) => {
      await member.deleteFromDB(transaction)
      await this.increaseVersion(transaction)
    })
  }

  public async increaseVersion(transaction: Transaction) {
    this.fc_edit()
    ++this.version
    await this.updateToDB(transaction)
  }

  public async destroyGroup(transaction?: Transaction) {
    const members = await this.getMembers()
    const permissions = await this.getPermissions()

    const handler = async (transaction: Transaction) => {
      for (const member of members) {
        await member.deleteFromDB(transaction)
      }
      for (const permission of permissions) {
        await permission.deleteFromDB(transaction)
      }
      await this.deleteFromDB(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = this.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
  }

  public static groupSearcher<T extends _CommonGroup<_CommonMember, _CommonPermission>>(
    this: { new (): T },
    space: GroupSpace | GroupSpace[],
    filterOptions: FilterOptions = {}
  ) {
    let spaces: GroupSpace[]
    if (Array.isArray(space)) {
      assert.ok(space.length > 0, '必须指定空间')
      spaces = space
    } else {
      spaces = [space]
    }

    const searcher = new this().fc_searcher(filterOptions)
    if (spaces.length === 1) {
      searcher.processor().addConditionKV('space', spaces[0])
    } else {
      searcher.processor().addConditionKeyInSet(`space`, ...spaces)
    }
    return searcher
  }

  public static groupBuilder<T extends _CommonGroup<_CommonMember, _CommonPermission>>(
    this: { new (): T },
    space: GroupSpace,
    operator: string
  ) {
    return new GroupBuilder(this, space, operator)
  }
}

class GroupBuilder<T extends _CommonGroup<_CommonMember, _CommonPermission>> {
  public readonly CommonGroup: typeof _CommonGroup
  public group: T
  public operator: string

  constructor(clazz: { new (): T }, space: GroupSpace, operator: string) {
    this.CommonGroup = clazz as any

    const group = new clazz()
    group.groupId = makeUUID()
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
      const CommonMember = this.CommonGroup.CommonMember
      const member = new CommonMember()
      member.groupId = this.group.groupId
      member.member = this.operator
      member.isAdmin = 1
      await member.strongAddToDB(transaction)
    }
    if (transaction) {
      await handler(transaction)
    } else {
      const runner = this.group.dbSpec().database.createTransactionRunner()
      await runner.commit(handler)
    }
    return this.group
  }
}
