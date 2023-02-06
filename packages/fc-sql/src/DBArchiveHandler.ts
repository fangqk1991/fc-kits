import * as moment from 'moment'
import { FCDatabase } from './FCDatabase'
import { SQLBulkAdder } from './SQLBulkAdder'
import { DBTableHandler } from './DBTableHandler'

interface SourceTableOptions {
  tableName: string
  columnName_primaryKey: string
  columnName_dataKey: string
  columnName_createTime: string
}

export interface DBArchiveOptions {
  database: FCDatabase
  sourceTable: SourceTableOptions
  archivedTableName: string
  compressing?: boolean
  retainedDays?: number // >= 0 的整数，默认 90 天
  pageSize?: number // 大于 0 的整数，默认 1000 条
}

export class DBArchiveHandler {
  private readonly options: DBArchiveOptions

  constructor(options: DBArchiveOptions) {
    this.options = options
  }

  public async execute() {
    const retainedDays =
      this.options.retainedDays === undefined || this.options.retainedDays < 0 ? 90 : this.options.retainedDays
    const pageSize = this.options.pageSize || 1000
    const database = this.options.database
    const tableName = this.options.sourceTable.tableName
    const columnName_primaryKey = this.options.sourceTable.columnName_primaryKey
    const columnName_dataKey = this.options.sourceTable.columnName_dataKey
    const columnName_createTime = this.options.sourceTable.columnName_createTime
    const archivedTableName = this.options.archivedTableName

    const tableHandler = new DBTableHandler(database, archivedTableName)
    const columns = await tableHandler.getColumns()
    const columnKeys = columns.map((item) => item.Field)
    const timestampKeys = columns.filter((item) => item.Type === 'timestamp').map((item) => item.Field)

    const keyTs = moment().unix() - retainedDays * 24 * 3600
    const searcher = database.searcher()
    searcher.setTable(tableName)
    searcher.setColumns(['*'])
    searcher.addSpecialCondition(`${columnName_createTime} < FROM_UNIXTIME(?)`, keyTs)
    const totalCount = await searcher.queryCount()
    let finished = false
    let processedCount = 0
    while (!finished) {
      const searcher = database.searcher()
      searcher.setTable(tableName)
      searcher.setColumns(['*'])
      searcher.addSpecialCondition(`${columnName_createTime} < FROM_UNIXTIME(?)`, keyTs)
      searcher.addOrderRule(columnName_primaryKey, 'ASC')
      searcher.setLimitInfo(0, pageSize)
      const items = await searcher.queryList()
      if (items.length > 0) {
        const runner = database.createTransactionRunner()
        await runner.commit(async (transaction) => {
          if (this.options.compressing) {
            const bulkAdder = new SQLBulkAdder(database)
            bulkAdder.transaction = transaction
            bulkAdder.setTable(archivedTableName)
            bulkAdder.setInsertKeys(['data_id', 'data_str', 'create_time'])
            bulkAdder.declareTimestampKey('create_time')
            for (let i = 0; i < items.length; ++i) {
              const item = items[i]
              bulkAdder.putObject({
                data_id: item[columnName_dataKey],
                data_str: JSON.stringify(item),
                create_time: item[columnName_createTime],
              })
            }
            await bulkAdder.execute()
          } else {
            const bulkAdder = new SQLBulkAdder(database)
            bulkAdder.transaction = transaction
            bulkAdder.setTable(archivedTableName)
            bulkAdder.setInsertKeys(columnKeys)
            bulkAdder.declareTimestampKey(...timestampKeys)
            for (let i = 0; i < items.length; ++i) {
              bulkAdder.putObject(items[i])
            }
            await bulkAdder.execute()
          }
          const remover = database.remover()
          remover.transaction = transaction
          remover.setTable(tableName)
          remover.addConditionKeyInArray(
            columnName_primaryKey,
            items.map((item) => item[columnName_primaryKey])
          )
          await remover.execute()
        })
      }
      finished = items.length === 0
      processedCount += items.length
      console.info(`[${tableName}] Archive records: ${processedCount} / ${totalCount}`)
    }
    console.info(`[${tableName}] ${processedCount} records archived.`)
  }
}
