import { SQLBuilderBase } from './SQLBuilderBase'
import * as assert from 'assert'
import * as moment from 'moment'
import { CommonFuncs } from './CommonFuncs'

type Value = string | number | null

interface InsertObject {
  [p: string]: Value
}

/**
 * @description Use for insert-sql
 */
export class SQLBulkAdder extends SQLBuilderBase {
  private _insertKeys: string[] = []
  private _insertObjects: InsertObject[] = []
  private _updateWhenDuplicate = false
  private _keepOldDataWhenDuplicate = false
  private _fixedKey: string = ''
  private _timestampMap: { [p: string]: boolean } = {}
  private _defaultValueForMissing: any = undefined

  public setInsertKeys(keys: string[]) {
    this._insertKeys = keys
    return this
  }

  public declareTimestampKey(...keys: string[]) {
    for (const key of keys) {
      this._timestampMap[key] = true
    }
  }

  public setMissingValue(defaultValueForMissing: string | number | null) {
    this._defaultValueForMissing = defaultValueForMissing
  }

  public putObject(data: { [p: string]: Value | Date }) {
    const obj = { ...data }
    assert.ok(this._insertKeys.length > 0, `${this.constructor.name}: insertKeys missing.`)
    if (this._defaultValueForMissing !== undefined) {
      this._insertKeys.forEach((key) => {
        if (!(key in obj)) {
          obj[key] = this._defaultValueForMissing
        }
      })
    } else {
      this._insertKeys.forEach((key) => {
        assert.ok(key in obj, `${this.constructor.name}: ${key} missing.`)
      })
    }
    for (const tsKey of Object.keys(this._timestampMap)) {
      obj[tsKey] = moment(obj[tsKey] as any).unix() || null
    }
    this._insertObjects.push(obj as InsertObject)
    return this
  }

  public useUpdateWhenDuplicate() {
    this._updateWhenDuplicate = true
    return this
  }

  public setFixedKey(fixedKey: string) {
    this._fixedKey = fixedKey
    return this
  }

  public keepOldDataWhenDuplicate() {
    assert.ok(!!this._fixedKey, `${this.constructor.name}: _fixedKey can not be empty.`)
    this._keepOldDataWhenDuplicate = true
    return this
  }

  public stmtValues(): Value[] {
    const values: Value[] = []
    this._insertObjects.forEach((obj) => {
      this._insertKeys.forEach((key) => {
        values.push(obj[key])
      })
    })
    return values
  }

  public async execute() {
    this.checkTableValid()
    if (this._insertObjects.length === 0) {
      return
    }

    const insertKeys = this._insertKeys
    const wrappedKeys = insertKeys.map((key) => CommonFuncs.wrapColumn(key))
    const values = this.stmtValues()
    const quotes: string[] = []
    for (const key of insertKeys) {
      quotes.push(this._timestampMap[key] ? `FROM_UNIXTIME(?)` : '?')
    }

    const valuesDesc = `(${quotes.join(', ')})`
    let query = `INSERT INTO ${this.table}(${wrappedKeys.join(', ')}) VALUES ${Array(this._insertObjects.length)
      .fill(valuesDesc)
      .join(', ')}`
    if (this._updateWhenDuplicate) {
      const additionItems = wrappedKeys.map((key) => `${key} = VALUES(${key})`)
      query = `${query} ON DUPLICATE KEY UPDATE ${additionItems.join(', ')}`
    } else if (this._keepOldDataWhenDuplicate) {
      const key = CommonFuncs.wrapColumn(this._fixedKey)
      query = `${query} ON DUPLICATE KEY UPDATE ${key} = VALUES(${key})`
    }
    await this.database.update(query, values, this.transaction)
  }
}
