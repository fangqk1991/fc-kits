import * as qs from 'qs'

export class RequestParams {
  public static buildQuery(
    params: { [p: string]: any },
    arrayFormat: 'indices' | 'brackets' | 'repeat' | 'comma' = 'repeat'
  ) {
    params = Object.assign({}, params)
    Object.keys(params).forEach((key) => {
      if (params[key] === null || params[key] === undefined) {
        delete params[key]
      }
    })
    return qs.stringify(params, {
      arrayFormat: arrayFormat,
    })
  }
}
