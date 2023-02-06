import { SQLBuilderBase } from './SQLBuilderBase'
import * as assert from 'assert'

export type OrderDirection = 'ASC' | 'DESC'

/**
 * @description Use for select-sql
 */
export class SQLSearcher extends SQLBuilderBase {
  private _queryColumns: string[] = []
  private _distinct: boolean = false
  private _offset: number = -1
  private _length: number = 1
  private _optionStr: string = ''
  private _optionStmts: (string | number)[] = []
  private _orderRules: { sortKey: string; sortDirection: OrderDirection }[] = []
  private _orderStmts: (string | number)[] = []
  private _groupKeys: string[] = []

  /**
   * @description As 'DISTINCT' in select-sql
   */
  public markDistinct() {
    this._distinct = true
    return this
  }

  /**
   * @description Set the columns you want to get
   */
  public setColumns(columns: string[]) {
    this._queryColumns = columns
    return this
  }

  /**
   * @description Add the column you want to get
   */
  public addColumn(column: string) {
    this._queryColumns.push(column)
    return this
  }

  /**
   * @description Add order rule for the result
   * @param sortKey {string}
   * @param direction {string}
   * @param args
   */
  public addOrderRule(sortKey: string, direction: OrderDirection = 'ASC', ...args: (string | number)[]) {
    if (direction.toUpperCase() === 'DESC') {
      direction = 'DESC'
    } else {
      direction = 'ASC'
    }
    this._orderRules.push({
      sortKey: sortKey,
      sortDirection: direction,
    })
    this._orderStmts.push(...args)
    return this
  }

  public removeAllOrderRules() {
    this._orderRules = []
    this._orderStmts = []
  }

  /**
   * @description Pass page index and lengthPerPage to build limit info, page's first index is 0
   * @param page {number}
   * @param lengthPerPage {number}
   */
  public setPageInfo(page: number, lengthPerPage: number) {
    this._length = lengthPerPage
    this._offset = page * this._length
    return this
  }

  /**
   * @description Set limit info, pass offset and length
   */
  public setLimitInfo(offset: number, length: number) {
    this._offset = Number(offset)
    this._length = Number(length)
    return this
  }

  /**
   * @description Set option statement, such as 'GROUP BY ...'
   * @param optionStr
   * @param args
   */
  public setOptionStr(optionStr: string, ...args: (string | number)[]) {
    this._optionStr = optionStr
    this._optionStmts = args
    return this
  }

  public checkColumnsValid() {
    assert.ok(this._queryColumns.length > 0, `${this.constructor.name}: _queryColumns missing.`)
    return this
  }

  private _columnsDesc(): string {
    return this._queryColumns
      .map((column: string): string => {
        if (/[()]/.test(column)) {
          return column
        }
        const [keyStr, ...others]: string[] = column.trim().split(' ')
        const formattedKeyStr = keyStr
          .split('.')
          .map((item: string): string => {
            const chars = item.replace(new RegExp('`', 'g'), '')
            return /^[a-zA-Z0-9_]+$/.test(chars) ? `\`${chars}\`` : chars
          })
          .join('.')
        if (others.length > 0 && !others[others.length - 1].includes('`')) {
          const key = others.pop() as string
          others.push(`\`${key.replace(new RegExp('`', 'g'), '')}\``)
        }
        return [formattedKeyStr, ...others].join(' ')
      })
      .join(', ')
  }

  public exportSQL() {
    this.checkTableValid()
    this.checkColumnsValid()

    let query = `SELECT ${this._distinct ? 'DISTINCT' : ''} ${this._columnsDesc()} FROM ${this.table}`
    const conditions = this.conditions()
    if (conditions.length) {
      query = `${query} WHERE ${this.buildConditionStr()}`
    }
    if (this._groupKeys.length > 0) {
      query = `${query} GROUP BY ${this._groupKeys.join(', ')}`
    }
    return { query: query, stmtValues: [...this.stmtValues()] }
  }

  public async execute() {
    return this.queryList()
  }

  /**
   * @description Execute it after preparing table, columns, conditions, get the record-list.
   */
  public async queryList() {
    if (this._length === 0) {
      return [] as { [p: string]: any }[]
    }
    const data = this.exportSQL()
    let query = data.query

    const stmtValues = data.stmtValues

    if (this._optionStr) {
      query = `${query} ${this._optionStr}`
    }
    stmtValues.push(...this._optionStmts)

    if (this._orderRules.length) {
      const orderItems = this._orderRules.map((rule): string => {
        let key = rule.sortKey
        if (/^\w+$/.test(key)) {
          key = `\`${key}\``
        }
        return `${key} ${rule.sortDirection}`
      })
      query = `${query} ORDER BY ${orderItems.join(', ')}`
    }
    stmtValues.push(...this._orderStmts)

    if (this._offset >= 0 && this._length >= 0) {
      query = `${query} LIMIT ${this._offset}, ${this._length}`
    }

    return (await this.database.query(query, stmtValues, this.transaction)) as { [p: string]: any }[]
  }

  /**
   * @description Got the first element of the return of 'queryList()', if list is empty, 'querySingle()' will return undefined.
   */
  public async querySingle() {
    this.setLimitInfo(0, 1)
    const items = await this.queryList()
    if (items.length > 0) {
      return items[0]
    }
    return undefined
  }

  /**
   * @description Execute it after preparing table, columns, conditions, get the record-count.
   */
  public async queryCount() {
    this.checkTableValid()
    assert.ok(this._groupKeys.length === 0, `${this.constructor.name}: groupBy does not apply to queryCount func.`)

    let query
    if (this._distinct) {
      query = `SELECT COUNT(DISTINCT ${this._columnsDesc()}) AS count FROM ${this.table}`
    } else {
      query = `SELECT COUNT(*) AS count FROM ${this.table}`
    }

    const conditions = this.conditions()
    if (conditions.length > 0) {
      query = `${query} WHERE ${this.buildConditionStr()}`
    }

    const result = await this.database.query(query, this.stmtValues(), this.transaction)
    return result[0]['count'] as number
  }

  public setGroupByKeys(keys: string[]) {
    this._groupKeys = keys
    return this
  }
}
