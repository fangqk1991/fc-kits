import { FCDatabase, DBTableHandler } from '../src'
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

describe('Test FCTable', () => {
  it(`Test Normal`, async () => {
    {
      const tableHandler = new DBTableHandler(database, 'nonexistent')
      assert.equal(await tableHandler.checkTableExists(), false)
    }

    const tableHandler = new DBTableHandler(database, 'demo_table')
    assert.equal(await tableHandler.checkTableExists(), true)
    const columns = await tableHandler.getColumns()
    assert.ok(columns.length > 0)
  })

  it(`Test Create / Drop`, async () => {
    const testTableName = 'temp_table_2'
    const tableHandler = new DBTableHandler(database, testTableName)
    await tableHandler.dropFromDatabase()
    assert.equal(await tableHandler.checkTableExists(), false)

    await tableHandler.createInDatabase()
    assert.equal(await tableHandler.checkTableExists(), true)

    const columns1 = await tableHandler.getColumns()
    assert.equal(columns1.length, 1)

    await tableHandler.addColumn('col_1', `INT`)
    await tableHandler.addColumn('col_2', `INT NOT NULL DEFAULT '0'`)

    const columns2 = await tableHandler.getColumns()
    assert.equal(columns1.length + 2, columns2.length)

    await tableHandler.dropColumn('col_2')
    const columns3 = await tableHandler.getColumns()
    assert.equal(columns2.length - 1, columns3.length)

    await tableHandler.changeColumn('col_1', 'BIGINT')
    const columns4 = await tableHandler.getColumns()
    assert.equal(columns3.length, columns4.length)
  })
})
