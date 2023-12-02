import { CellValue, Row, stream, Workbook, Worksheet } from 'exceljs'
import assert from '@fangcha/assert'

interface StringDict {
  [p: string]: string
}

interface TypicalExcelOptions {
  defaultColumnWidth?: number
  headerNameMap?: StringDict
  stream?: any
  writeFilePath?: string
}

const fitRowHeight = (row: Row) => {
  let maxLines = 1
  const values = row.values as CellValue[]
  for (const val of values) {
    maxLines = Math.max(maxLines, `${val}`.split('\n').length)
  }
  row.height = maxLines * 14
}

export interface TypicalColumn<T> {
  columnKey: string
  columnName: string
  columnValue?: (item: T) => any
  width?: number
}

export interface ExcelParseOptions {
  name2keyMap?: StringDict
  text2ValueTransform?: (text: string, curKey: string) => any
}

export class TypicalExcel<T extends object = {}> {
  public readonly columnKeys: string[] = []
  protected readonly _workbook: Workbook
  protected readonly _sheet: Worksheet
  protected readonly _extraHeaders: StringDict[] = []
  protected readonly _records: T[] = []
  protected readonly _options: TypicalExcelOptions
  public fileName = ''
  public useBorder = false

  public constructor(columnKeys: string[], options: TypicalExcelOptions = {}) {
    this._options = options
    this.columnKeys = columnKeys
    const headerNameMap = options.headerNameMap || {}
    const columns = this.columnKeys.map((key) => {
      const data: any = {
        header: headerNameMap[key] !== undefined ? headerNameMap[key] : key,
        key: key,
      }
      if (options.defaultColumnWidth) {
        data['width'] = options.defaultColumnWidth
      }
      return data
    })
    if (options.stream) {
      this._workbook = new stream.xlsx.WorkbookWriter({
        stream: options.stream,
      })
    } else if (options.writeFilePath) {
      this._workbook = new stream.xlsx.WorkbookWriter({
        filename: options.writeFilePath,
      })
    } else {
      this._workbook = new Workbook()
    }
    this._sheet = this._workbook.addWorksheet('Sheet1')
    this._sheet.columns = columns
  }

  public typicalColumns?: TypicalColumn<T>[]
  public static excelWithTypicalColumns<T extends object = {}>(
    columns: TypicalColumn<T>[],
    options1: TypicalExcelOptions = {}
  ) {
    const columnKeys = columns.map((item) => item.columnKey)
    const options: TypicalExcelOptions = {
      headerNameMap: {},
    }
    for (const item of columns) {
      options.headerNameMap![item.columnKey] = item.columnName
    }
    if (options1.stream) {
      options.stream = options1.stream
    }
    if (options1.writeFilePath) {
      options.writeFilePath = options1.writeFilePath
    }
    const obj = new TypicalExcel<T>(columnKeys, options)
    for (const item of columns) {
      if (item.width !== undefined) {
        obj.setColumnWidth(item.columnKey, item.width)
      }
    }
    obj.typicalColumns = columns
    return obj
  }

  public addTypicalRow(...rawDataList: T[]) {
    this.addTypicalRowList(rawDataList)
  }

  public addTypicalRowList(rawDataList: T[]) {
    assert.ok(!!this.typicalColumns, '此操作依赖于 typicalColumns 定义')
    rawDataList.forEach((rawData) => {
      const data: any = {}
      this.typicalColumns!.forEach((column) => {
        data[column.columnKey] = column.columnValue ? column.columnValue(rawData) : rawData[column.columnKey]
      })
      this._records.push(data)
      this._sheet.addRow(data)
    })
  }

  public workSheet() {
    return this._sheet
  }

  public setColumnWidth(columnKey: string, width: number) {
    this._sheet.getColumn(columnKey).width = width
  }

  public setColumnName(columnKey: string, name: string) {
    this._sheet.getColumn(columnKey).header = name
  }

  public addExtraHeader(data: StringDict, fitHeight = false) {
    this._extraHeaders.push(data)
    const row = this._sheet.addRow(data)
    if (fitHeight) {
      fitRowHeight(row)
    }
    return row
  }

  /**
   * @description dataList 长度过大时，请使用 addRowList
   * @param dataList
   */
  public addRow(...dataList: any[]) {
    this.addRowList(dataList)
  }

  public addRowList(dataList: any[]) {
    dataList.forEach((data) => {
      this._records.push(data)
      this._sheet.addRow(data)
    })
  }

  public extraHeaders() {
    return this._extraHeaders
  }

  public records() {
    return this._records
  }

  public buildWorkbook() {
    if (this.useBorder) {
      this._sheet.eachRow((row) => {
        row.eachCell((cell) => {
          cell.border = {
            top: { style: 'thin' },
            left: { style: 'thin' },
            bottom: { style: 'thin' },
            right: { style: 'thin' },
          }
        })
      })
    }
    return this._workbook
  }

  public async writeFile(filePath: string) {
    await this.buildWorkbook().xlsx.writeFile(filePath)
  }

  public async writeBuffer() {
    return this.buildWorkbook().xlsx.writeBuffer()
  }

  public async commit() {
    assert.ok(!!this._options.writeFilePath || !!this._options.stream, 'writeFilePath 必须定义')
    const workbook = this.buildWorkbook() as stream.xlsx.WorkbookWriter
    return workbook.commit()
  }

  public static async parseWorkbook<T extends object = {}>(workbook: Workbook, options: ExcelParseOptions = {}) {
    const name2keyMap = options.name2keyMap || {}
    const text2ValueTransform = options.text2ValueTransform || ((text) => text)
    const sheet = workbook.worksheets[0]
    assert.ok(sheet.rowCount > 0, 'No Data')
    const firstRow = sheet.getRow(1)
    const columnNames = (firstRow.values as []).slice(1) as string[]
    const columnKeys: string[] = []
    const headerNameMap: StringDict = {}
    columnNames.forEach((name) => {
      const key = name2keyMap[name] || name
      columnKeys.push(key)
      headerNameMap[key] = name
    })
    const records: any[] = []
    for (let i = 2; i <= sheet.rowCount; ++i) {
      const data: any = {}
      const row = sheet.getRow(i)
      let notEmpty = false
      columnKeys.forEach((columnKey, index) => {
        const value = (row.values as [])[index + 1]
        data[columnKey] = text2ValueTransform(value !== undefined ? value : '', columnKey)
        if (Object.prototype.toString.call(value) === '[object Object]') {
          const cell = row.getCell(index + 1)
          data[columnKey] = text2ValueTransform(cell.text, columnKey)
        }
        if (data[columnKey] !== '') {
          notEmpty = true
        }
      })
      if (notEmpty) {
        records.push(data)
      }
    }
    const excel = new this<T>(columnKeys, {
      headerNameMap: headerNameMap,
    })
    records.forEach((record) => {
      excel.addRow(record)
    })
    return excel
  }

  public static async excelFromFile<T extends object = {}>(filePath: string, options: ExcelParseOptions = {}) {
    const workbook = new Workbook()
    await workbook.xlsx.readFile(filePath)
    return this.parseWorkbook<T>(workbook, options)
  }

  public static async excelFromBuffer<T extends object = {}>(buffer: Buffer, options: ExcelParseOptions = {}) {
    const workbook = new Workbook()
    await workbook.xlsx.load(buffer)
    return this.parseWorkbook<T>(workbook, options)
  }
}
