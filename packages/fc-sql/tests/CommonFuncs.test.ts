import { CommonFuncs } from '../src/CommonFuncs'

describe('Test CommonFuncs.test.ts', (): void => {
  it(`Test wrapColumn`, async () => {
    console.info(CommonFuncs.wrapColumn(''))
    console.info(CommonFuncs.wrapColumn(null as any))
  })
})
