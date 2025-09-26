import { makeUUID } from '@fangcha/tools'

export interface TestTableView_SomeData {
  uid: string
  value: number
}

export class TestTableView_Tools {
  public static makeDataList(count = 10) {
    return new Array(count).fill(null).map(() => {
      const data: TestTableView_SomeData = {
        uid: makeUUID(),
        value: Math.random(),
      }
      return data
    })
  }
}
