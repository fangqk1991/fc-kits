import { FCDatabase, SQLBulkAdder, SQLSearcher } from '../src'
import * as assert from 'assert'

const database = FCDatabase.getInstance()
database.init({
  host: '127.0.0.1',
  port: 3306,
  dialect: 'mysql',
  database: 'demo_db',
  username: 'root',
  password: '',
  timezone: '+00:00',
  // logging: false,
})

export const demoDatabase = database

export const generateRecords = async (count: number) => {
  const countBefore = await fetchRecordCount()
  const bulkAdder = new SQLBulkAdder(database)
  bulkAdder.setTable('demo_table')
  bulkAdder.setInsertKeys(['key1', 'key2'])
  for (let i = 0; i < count; ++i) {
    bulkAdder.putObject({
      key1: `Bulk K1 - ${Math.random()}`,
      key2: `Bulk K2 - ${Math.random()}`,
    })
  }
  await bulkAdder.execute()
  const countAfter = await fetchRecordCount()
  assert.ok(countBefore + count === countAfter)
}

export const fetchRecordCount = async () => {
  const searcher = new SQLSearcher(database)
  searcher.setTable('demo_table')
  searcher.setColumns(['*'])
  return searcher.queryCount()
}

export const getOneRecord = async () => {
  const searcher = new SQLSearcher(database)
  searcher.setTable('demo_table')
  searcher.setColumns(['*'])
  return searcher.querySingle()
}
