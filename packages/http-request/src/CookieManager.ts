export class CookieManager {
  private _data: any

  constructor(cookieStr: string) {
    this._data = {}

    const arr = cookieStr.split('; ')
    for (let i = 0; i < arr.length; ++i) {
      const key = arr[i].split('=')[0]
      this._data[key] = arr[i].substring(arr[i].indexOf('=') + 1).replace(/"/g, '')
    }
  }

  get(key: string, defValue: any = '') {
    return this._data[key] || defValue
  }
}
