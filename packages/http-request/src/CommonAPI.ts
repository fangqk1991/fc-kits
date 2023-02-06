import * as assert from 'assert'

export interface ApiOptions {
  method: string
  route?: string
  api?: string
  description?: string
  extras?: any
}

export class CommonAPI implements ApiOptions {
  /**
   * @deprecated Use route instead
   */
  public rawAPI: string
  public route: string
  public method: string
  public extras: any
  public description: string
  public api: string

  constructor(options: ApiOptions, ...replacements: (string | number)[]) {
    assert.ok(typeof options === 'object')
    assert.ok(!!options.route || !!options.api, `"route" or "api" must in options`)
    assert.ok(!!options.method, `"method" must in options`)
    if (options.api) {
      this.api = options.api
      this.route = this.api
      this.rawAPI = this.api
    } else {
      const route = options.route || ''
      this.api = CommonAPI.buildUrl(route, ...replacements)
      this.route = route
      this.rawAPI = route
    }
    this.method = options.method
    this.extras = options.extras || {}
    this.description = options.description || ''
  }

  public static create(options: ApiOptions, ...replacements: (string | number)[]) {
    return new CommonAPI(options, ...replacements)
  }

  public static buildUrl(route: string, ...replacements: (string | number)[]) {
    let index = 0
    const url = route.replace(/:([_a-zA-Z][\w-]*)/g, () => {
      return `${replacements[index++]}`
    })
    assert.ok(index === replacements.length)
    return url
  }

  toString() {
    return `${this.method} ${this.api} (${this.description})`
  }
}
