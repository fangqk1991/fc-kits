import { SQLBuilderBase } from './SQLBuilderBase'
import * as assert from 'assert'

/**
 * @description Use for delete-sql
 */
export class SQLRemover extends SQLBuilderBase {
  public async execute() {
    this.checkTableValid()
    assert.ok(this.conditionColumns.length > 0, `${this.constructor.name}: conditionColumns missing.`)

    const query = `DELETE FROM ${this.table} WHERE (${this.conditions().join(' AND ')})`
    await this.database.update(query, this.stmtValues(), this.transaction)
  }
}
