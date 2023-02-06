class DummyObservable {
  mName: string
  mList: any[]

  constructor(name: string) {
    this.mName = name
    this.mList = []
  }

  public addObserver(observer: Function) {
    if (typeof observer !== 'function') {
      throw new Error('observer must be a function')
    }

    for (let i = 0, max = this.mList.length; i < max; ++i) {
      if (this.mList[i] === observer) {
        return
      }
    }

    this.mList.push(observer)
  }

  public removeObserver(observer: Function) {
    for (let i = 0, max = this.mList.length; i < max; ++i) {
      if (this.mList[i] === observer) {
        this.mList.splice(i, 1)
        break
      }
    }
  }

  public notifyObservers(object: any) {
    for (let i = 0, max = this.mList.length; i < max; ++i) {
      let observer = this.mList[i]
      observer && observer(object)
    }
  }
}

let _instance: any

export class NotificationCenter {
  mObservables: any = {}

  addObserver(key: string, observer: Function) {
    let observable = this.mObservables[key]
    if (observable === undefined) {
      observable = new DummyObservable(key)
      this.mObservables[key] = observable
    }

    observable.addObserver(observer)
  }

  removeObserver(key: string, observer: Function) {
    let observable = this.mObservables[key]
    if (observable !== undefined) {
      observable.removeObserver(observer)
    }
  }

  postNotification(key: string, object: any = null) {
    let observable = this.mObservables[key]
    if (observable !== undefined) {
      observable.notifyObservers(object)
    }
  }

  static defaultCenter() {
    if (!_instance) {
      _instance = new NotificationCenter()
    }
    return _instance as NotificationCenter
  }
}
