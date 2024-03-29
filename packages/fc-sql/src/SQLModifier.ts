import { SQLBuilderBase } from './SQLBuilderBase'
import * as assert from 'assert'
import * as moment from 'moment'

/**
 * @description Use for update-sql
 */
export class SQLModifier extends SQLBuilderBase {
  _updateColumns: string[] = []
  _updateValues: (string | number | null)[] = []

  /**
   * @description Pass the column you want to update, and the new value.
   * @param key {string}
   * @param value {string | number | null}
   */
  updateKV(key: string, value: string | number | null) {
    if (/^\w+$/.test(key)) {
      key = `\`${key}\``
    }
    this._updateColumns.push(`${key} = ?`)
    this._updateValues.push(value !== undefined ? value : null)
    return this
  }

  public updateKVForTimestamp(key: string, value: Date | string | any) {
    if (/^\w+$/.test(key)) {
      key = `\`${key}\``
    }
    const tsValue = moment(value).unix() || null
    if (tsValue) {
      this._updateColumns.push(`${key} = FROM_UNIXTIME(?)`)
      this._updateValues.push(tsValue)
    } else {
      this.updateKV(key, null)
    }
    return this
  }

  public updateExpression(expression: string, ...args: (string | number | null)[]) {
    return this._updateExpression(expression, args)
  }

  private _updateExpression(expression: string, args: (string | number | null)[]) {
    assert.ok(
      (expression.match(/\?/g) || []).length === args.length,
      `${this.constructor.name}: _updateSpecialKV: Incorrect number of arguments.`
    )
    this._updateColumns.push(`${expression}`)
    this._updateValues = this._updateValues.concat(args)
    return this
  }

  stmtValues(): (string | number | null)[] {
    return this._updateValues.concat(this.conditionValues).map((val) => {
      if (val === undefined) {
        return null
      }
      return !!val && typeof val === 'object' ? JSON.stringify(val) : val
    })
  }

  public async execute() {
    this.checkTableValid()
    if (this._updateColumns.length === 0) {
      return
    }
    assert.ok(this.conditionColumns.length > 0, `${this.constructor.name}: conditionColumns missing.`)

    const query = `UPDATE ${this.table} SET ${this._updateColumns.join(', ')} WHERE (${this.conditions().join(
      ' AND '
    )})`
    await this.database.updateV2(query, {
      ...this.options,
      replacements: this.stmtValues(),
      transaction: this.transaction || this.options.transaction,
    })
  }
}
