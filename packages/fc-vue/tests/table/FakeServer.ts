declare global {
  interface Array<T> {
    removeObject(item: T): void
    removeObjectAtIndex(index: number): void
    removeAllObjects(): void
    addObjectsFromArray(items: Array<T>): void
    addObject(item: T): void
    insertObjectAtIndex(item: T, index: number): void
  }
}

Array.prototype.removeObject = function (object) {
  for (let index = 0; index < this.length; ++index) {
    if (object === this[index]) {
      this.splice(index, 1)
      break
    }
  }
}
Array.prototype.removeObjectAtIndex = function (index) {
  this.splice(index, 1)
}
Array.prototype.removeAllObjects = function () {
  this.length = 0
}
Array.prototype.addObjectsFromArray = function (items) {
  Array.prototype.push.apply(this, items)
}
Array.prototype.addObject = function (item) {
  this.push(item)
}
Array.prototype.insertObjectAtIndex = function (item, index) {
  this.splice(index, 0, item)
}

export interface DemoRecord {
  index: number
  value: number
}

class _FakeServer {
  private _records: DemoRecord[]
  private _maxIndex = 100

  constructor() {
    this._records = new Array(this._maxIndex)
      .fill('')
      .map((_, index) => {
        const item: DemoRecord = {
          index: index,
          value: Math.random(),
        }
        return item
      })
      .reverse()
  }

  public requestPageData(params: { _offset: number; _length: number; level: string }) {
    const matchRecords = this._records.filter((record) => {
      if (params.level === 'Low') {
        return record.value < 0.5
      } else if (params.level === 'High') {
        return record.value >= 0.5
      }
      return true
    })
    return {
      elements: matchRecords.slice(params._offset, params._offset + params._length),
      totalSize: matchRecords.length,
    }
  }

  public createRecord(params: { value: number | string }) {
    const record: DemoRecord = {
      index: this._maxIndex,
      value: Number(params.value),
    }
    this._records.insertObjectAtIndex(record, 0)
    ++this._maxIndex
    return record
  }

  public updateRecord(recordIndex: number, params: { value: number | string }) {
    const record = this._records.find((item) => item.index === recordIndex)
    if (record) {
      record.value = Number(params.value)
    }
  }

  public deleteRecord(record: DemoRecord) {
    this._records.removeObject(record)
  }
}

export const FakeServer = new _FakeServer()
