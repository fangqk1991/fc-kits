import * as assert from 'assert'
import * as fs from 'fs'
import { TypicalExcel } from '../../src'
import { DiffMapper } from '@fangcha/tools'

describe('Test TypicalExcel', () => {
  it(`Test Write / Read`, async () => {
    const filepath = `${__dirname}/run.local/xx.xlsx`

    const columnKeys = ['id', 'name', 'date']
    const excel = new TypicalExcel(columnKeys, {
      headerNameMap: {
        id: 'ID',
        name: 'Name',
        date: 'Date',
      },
    })
    excel.addRow({ id: 1, name: 'A', date: new Date('2018-01-01') })
    excel.addRow({ id: 2, name: 'B', date: new Date('2019-01-01') })
    await excel.writeFile(filepath)

    const excel2 = await TypicalExcel.excelFromFile(filepath, {
      ID: 'id',
      Name: 'name',
      Date: 'date',
    })
    console.info(excel2.records())
    assert.ok(DiffMapper.checkEquals(excel.columnKeys, columnKeys))
    assert.ok(DiffMapper.checkEquals(excel.columnKeys, excel2.columnKeys))
    assert.ok(DiffMapper.checkEquals(excel.extraHeaders(), excel2.extraHeaders()))
    assert.ok(DiffMapper.checkEquals(excel.records(), excel2.records()))
  })

  it(`Test Stream To File`, async () => {
    const filepath = `${__dirname}/run.local/xx.xlsx`

    const columnKeys = ['id', 'name', 'date']
    const excel = new TypicalExcel(columnKeys, {
      writeFilePath: filepath,
    })
    excel.addRow({ id: 1, name: 'A', date: new Date('2018-01-01') })
    excel.addRow({ id: 2, name: 'B', date: new Date('2019-01-01') })
    await excel.commit()
  })

  it(`Test Stream`, async () => {
    const filepath = `${__dirname}/run.local/xx.xlsx`
    const stream = fs.createWriteStream(filepath)

    const columnKeys = ['id', 'name', 'date']
    const excel = new TypicalExcel(columnKeys, {
      stream: stream,
    })
    excel.addRow({ id: 1, name: 'A', date: new Date('2018-01-01') })
    excel.addRow({ id: 2, name: 'B', date: new Date('2019-01-01') })
    await excel.commit()
  })
})
