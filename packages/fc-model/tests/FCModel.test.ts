import ModelMainEx from './ModelMainEx'
import ModelSubEx from './ModelSubEx'
import * as assert from 'assert'
import { DiffMapper } from '@fangcha/tools'

const getTestData = () => {
  return {
    xyy: 1,
    xxx_yyy: 'hehehe',
    xxx: 'ttt',
    sub_obj: {
      name: 'Sub - Obj',
    },
    sub_items: [{ name: 'Sub - Obj - 1', nick_name: 'xxx 123' }, { name: 'Sub - Obj - 2' }, { name: 'Sub - Obj - 3' }],
  }
}

describe('Test FCModel', (): void => {
  it(`Test Normal`, (): void => {
    const data = getTestData()

    const obj = new ModelMainEx()
    obj.fc_generate(data)

    assert.ok(obj.xyy === data['xyy'])
    assert.ok(obj.xxxYYY === data['xxx_yyy'])
    assert.ok(obj.subObj instanceof ModelSubEx && obj.subObj.name === data['sub_obj']['name'])
    assert.ok(Array.isArray(obj.subItems) && obj.subItems.length === data['sub_items'].length)

    const retMap = obj.fc_encode()
    assert.ok(retMap['xyy'] === data['xyy'])
    assert.ok(retMap['xxx_yyy'] === data['xxx_yyy'])
    assert.ok(!retMap['xxx'])

    const pureModel = obj.fc_pureModel()
    assert.ok(pureModel['xyy'] === data['xyy'])
    assert.ok(pureModel['xxxYYY'] === data['xxx_yyy'])
    assert.ok(!pureModel['xxx'])
    console.info(obj)
    console.info(pureModel)
  })

  it(`Test Modify Generate`, (): void => {
    const obj = new ModelMainEx()
    obj.fc_generate({})
    Object.keys(obj.fc_propertyMapper()).forEach((key) => {
      const _obj = obj as any
      assert.ok(_obj[key] === undefined)
    })
    obj.fc_generate({ a: 1, xyy: 2 })
    assert.equal(obj.xyy, 2)
    assert.equal('a' in obj, false)
  })

  it(`Test fc_generateWithModel`, (): void => {
    const data = getTestData()

    const obj = new ModelMainEx()
    obj.fc_generate(data)

    const obj2 = new ModelMainEx()
    obj2.fc_generateWithModel(obj)
    assert.ok(DiffMapper.checkEquals(obj, obj2))
  })
})
