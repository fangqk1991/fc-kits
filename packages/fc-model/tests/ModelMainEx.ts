import { FCModel } from '../src'
import ModelSubEx from './ModelSubEx'

export default class ModelMainEx extends FCModel {
  public xyy: any
  public xxxYYY: any
  public subObj: any
  public subItems: any
  public noGiven: any

  fc_propertyMapper(): { [p: string]: string } {
    return {
      xyy: 'xyy',
      xxxYYY: 'xxx_yyy',
      subObj: 'sub_obj',
      subItems: 'sub_items',
      noGiven: 'no_given',
    }
  }

  fc_propertyClassMapper(): { [p: string]: { new (): FCModel } } {
    return {
      subObj: ModelSubEx,
    }
  }

  fc_arrayItemClassMapper(): { [p: string]: { new (): FCModel } } {
    return {
      subItems: ModelSubEx,
    }
  }
}
