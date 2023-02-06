import assert = require('assert')
import { RequestParams } from '../RequestParams'
import { AppRequest } from './AppRequest'
import { ApiOptions } from '../CommonAPI'

const _defaultTimeout = 15000

/**
 * @deprecated AxiosBuilder is recommended
 */
export class RequestBuilder {
  private readonly _urlBase: string

  constructor(urlBase: string) {
    this._urlBase = urlBase
  }

  static _loadDefaultConfig(request: AppRequest) {
    request.setTimeout(_defaultTimeout)
  }

  onPrepare(apiObj: ApiOptions, _queryParams: any = {}, _body: any = null) {}

  buildRequest(apiObj: ApiOptions, queryParams = {}, body: any = null): AppRequest {
    assert.ok('method' in apiObj)
    assert.ok('api' in apiObj)

    this.onPrepare(apiObj, queryParams, body)

    let uri = `${this._urlBase}${apiObj.api}`
    if (queryParams && Object.keys(queryParams).length > 0) {
      uri = `${uri}?${RequestParams.buildQuery(queryParams)}`
    }
    const request = new AppRequest(apiObj.method, uri)
    if (body !== null) {
      request.setBody(body)
    }
    RequestBuilder._loadDefaultConfig(request)
    return request
  }

  static buildRequestForGET(uri: string, queryParams = {}): AppRequest {
    if (queryParams && Object.keys(queryParams).length > 0) {
      uri = `${uri}?${RequestParams.buildQuery(queryParams)}`
    }
    const request = new AppRequest('GET', uri)
    RequestBuilder._loadDefaultConfig(request)
    return request
  }

  static buildRequestForPOST(uri: string): AppRequest {
    const request = new AppRequest('POST', uri)
    RequestBuilder._loadDefaultConfig(request)
    return request
  }
}
