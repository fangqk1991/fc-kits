interface MapProtocol {
  [p: string]: any
}

export class FCModel implements MapProtocol {
  /**
   * @description It will be executed in constructor
   */
  fc_defaultInit(): void {}

  fc_afterGenerate(_data: MapProtocol = {}): void {}

  /**
   * @description Mapping table for (class-property => data-json-key)
   */
  fc_propertyMapper(): { [p: string]: string } {
    throw new Error(`You must override the perform method.`)
  }

  constructor() {
    const _this = this as any
    const propertyList = Object.keys(this.fc_propertyMapper())
    propertyList.forEach((property: string) => {
      _this[property] = undefined
    })
    this.fc_defaultInit()
  }

  /**
   * @description Pass json data to build properties of the instance.
   * @param data
   */
  public fc_generate(data: MapProtocol): void {
    this._generate(data, false)
  }

  /**
   * @description Pass model data to build properties of the instance.
   * @param data
   */
  public fc_generateWithModel(data: MapProtocol): void {
    this._generate(data, true)
  }

  private _generate(data: MapProtocol, forProperties: boolean = false): void {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    for (const property in propertyMap) {
      const targetKey = forProperties ? property : propertyMap[property]

      if (property in propertyClassMap && data[targetKey] !== null && typeof data[targetKey] === 'object') {
        const obj = new propertyClassMap[property]()
        if (obj instanceof FCModel) {
          obj._generate(data[targetKey], forProperties)
          const _this = this as MapProtocol
          _this[property] = obj
        }
      } else if (property in itemClassMap && Array.isArray(data[targetKey])) {
        const arr: any[] = []
        data[targetKey].forEach((dic: {}): void => {
          const obj = new itemClassMap[property]()
          if (obj instanceof FCModel) {
            obj._generate(dic, forProperties)
            arr.push(obj)
          } else {
            arr.push(null)
          }
        })
        const _this = this as MapProtocol
        _this[property] = arr
      } else {
        const _this = this as MapProtocol
        if (targetKey in data) {
          _this[property] = data[targetKey]
        } else {
          if (!(property in _this)) {
            _this[property] = undefined
          }
        }
      }
    }

    this.fc_afterGenerate(data)
  }

  private _encode(forProperties: boolean = false) {
    const propertyMap = this.fc_propertyMapper()
    const propertyClassMap = this.fc_propertyClassMapper()
    const itemClassMap = this.fc_arrayItemClassMapper()

    const data: MapProtocol = {}
    for (const property in propertyMap) {
      const targetKey = forProperties ? property : propertyMap[property]
      if (property in this) {
        const entity = (this as MapProtocol)[property]
        if (property in propertyClassMap && entity instanceof FCModel) {
          data[targetKey] = forProperties ? entity.fc_pureModel() : entity.fc_encode()
        } else if (property in itemClassMap && Array.isArray(entity)) {
          data[targetKey] = entity.map((item): {} => {
            return forProperties ? item.fc_pureModel() : item.fc_encode()
          })
        } else {
          data[targetKey] = entity
        }
      }
    }

    return data
  }

  /**
   * @description Export JSON data, keys as fc_propertyMapper()'s values
   */
  public fc_encode(): MapProtocol {
    return this._encode(false)
  }

  /**
   * @description Export pure model data, keys as fc_propertyMapper()'s keys
   */
  public fc_pureModel(): MapProtocol {
    return this._encode(true)
  }

  /**
   * @description If some property is FCModel's sub class instance, declare the class in this mapper.
   */
  public fc_propertyClassMapper(): { [p: string]: { new (): FCModel } } {
    return {}
  }

  /**
   * @description If some property is an array of FCModel's sub class instance, declare the class in this mapper.
   */
  public fc_arrayItemClassMapper(): { [p: string]: { new (): FCModel } } {
    return {}
  }

  public toString() {
    return JSON.stringify(this.fc_pureModel(), null, 2)
  }
}
