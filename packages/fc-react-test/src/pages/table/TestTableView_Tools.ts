import { makeUUID } from '@fangcha/tools'

export interface TestTableView_SomeData {
  uid: string
  value: number
}

export class TestTableView_Tools {
  public static makeDataList() {
    return new Array(10).fill(null).map(() => {
      const data: TestTableView_SomeData = {
        uid: makeUUID(),
        value: Math.random(),
      }
      return data
    })
  }
}
