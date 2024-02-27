import { FCDatabase } from './FCDatabase'
import { SQLSearcher } from './SQLSearcher'
import { Transaction } from 'sequelize'

export interface DBColumn {
  Field: string
  Type: string
  Collation: string
  Null: string
  Key: string
  Default: string | null
  Extra: string
  Privileges: string
  Comment: string
}

interface RawDBIndex {
  Table: string
  Non_unique: number
  Key_name: 'PRIMARY' | string
  Seq_in_index: number
  Column_name: string
  Collation: string // 'A'
  Null: string
  Comment: string
}

export interface DBIndex {
  table: string
  indexKey: 'PRIMARY' | string
  isUnique: boolean
  columns: string[]
}

export class DBTableHandler {
  public tableName: string
  public database: FCDatabase
  public transaction!: Transaction

  public constructor(database: FCDatabase, name: string) {
    this.tableName = name
    this.database = database
  }

  public async getColumns() {
    const sql = `SHOW FULL COLUMNS FROM \`${this.tableName}\``
    return (await this.database.queryV2(sql, {
      transaction: this.transaction,
    })) as DBColumn[]
  }

  public async getIndexes() {
    const sql = `SHOW INDEXES FROM \`${this.tableName}\``
    const rawItems = (await this.database.queryV2(sql, {
      transaction: this.transaction,
    })) as RawDBIndex[]
    const groupMap: { [indexName: string]: RawDBIndex[] } = {}
    rawItems.forEach((item) => {
      if (!groupMap[item.Key_name]) {
        groupMap[item.Key_name] = []
      }
      groupMap[item.Key_name].push(item)
    })
    return Object.values(groupMap).map((group): DBIndex => {
      return {
        table: group[0].Table,
        indexKey: group[0].Key_name,
        isUnique: group[0].Non_unique === 0,
        columns: group.map((item) => item.Column_name),
      }
    })
  }

  public async checkTableExists() {
    const searcher = new SQLSearcher(this.database)
    searcher.transaction = this.transaction
    searcher.setTable('information_schema.tables')
    searcher.addConditionKV('table_schema', this.database.dbName())
    searcher.addConditionKV('table_name', this.tableName)
    return (await searcher.queryCount()) > 0
  }

  public async createInDatabase() {
    if (await this.checkTableExists()) {
      return false
    }

    const sql = `CREATE TABLE \`${this.tableName}\` (rid BIGINT UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY)`
    await this.database.updateV2(sql, {
      transaction: this.transaction,
    })
  }

  public async dropFromDatabase() {
    if (!(await this.checkTableExists())) {
      return false
    }

    const sql = `DROP TABLE \`${this.tableName}\``
    await this.database.updateV2(sql, {
      transaction: this.transaction,
    })
  }

  public async addColumn(columnName: string, columnSpec: string) {
    const columns = await this.getColumns()
    const lastColumn = columns.pop() as DBColumn
    const sql = `ALTER TABLE \`${this.tableName}\` ADD \`${columnName}\` ${columnSpec} AFTER \`${lastColumn.Field}\``
    await this.database.updateV2(sql, {
      transaction: this.transaction,
    })
  }

  public async changeColumn(columnName: string, columnSpec: string) {
    const sql = `ALTER TABLE \`${this.tableName}\` CHANGE \`${columnName}\` \`${columnName}\` ${columnSpec}`
    await this.database.updateV2(sql, {
      transaction: this.transaction,
    })
  }

  public async dropColumn(columnName: string) {
    const sql = `ALTER TABLE \`${this.tableName}\` DROP \`${columnName}\``
    await this.database.updateV2(sql, {
      transaction: this.transaction,
    })
  }
}
