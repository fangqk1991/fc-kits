import { FCModel } from '../src'

export default class ModelSubEx extends FCModel {
  public name: any
  public nickName: any

  fc_propertyMapper(): { [p: string]: string } {
    return {
      name: 'name',
      nickName: 'nick_name',
    }
  }
}
