import { NotificationCenter } from '../src'

const center = NotificationCenter.defaultCenter()

describe('NotificationCenter', () => {
  it(`Test Functions`, () => {
    const someKey1 = 'someKey1'
    const someKey2 = 'someKey2'
    center.addObserver(someKey1, (obj: any) => {
      console.log(`${someKey1} be called, params: `, obj)
    })
    center.addObserver(someKey2, (obj: any) => {
      console.log(`${someKey2} be called, params: `, obj)
    })

    center.postNotification(someKey1, 1)
    center.postNotification(someKey1, 2)
    center.postNotification(someKey1, 3)

    center.postNotification(someKey2, 'A')
    center.postNotification(someKey2, 'B')
    center.postNotification(someKey2, 'C')

    center.postNotification(someKey1, 4)
    center.postNotification(someKey1, 5)
    center.postNotification(someKey1, 6)

    const center2 = new NotificationCenter()
    center2.postNotification(someKey1, 'Not Displayed.')
  })
})
