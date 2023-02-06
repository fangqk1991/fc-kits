import { LinkedNode } from './LinkedNode'

export class AppQueue<T> {
  private _head: LinkedNode<T> | null
  private _tail: LinkedNode<T> | null
  private _length: number

  public constructor () {
    this._head = null
    this._tail = null
    this._length = 0
  }

  public size() {
    return this._length
  }

  public push(obj: T) {
    const node = new LinkedNode(obj)

    if (this.isEmpty()) {
      this._head = node
      this._tail = node
    } else {
      this._tail!.next = node
      this._tail = node
    }

    ++this._length
  }

  public popFirst() {
    if (this.isEmpty()) {
      throw new Error(`Empty queue can not pop item`)
    }

    const obj = this.getFirst()

    --this._length
    if (this.isEmpty()) {
      this._head = null
      this._tail = null
    } else {
      this._head = this._head!.next
    }

    return obj as T
  }

  public getFirst() {
    if (this.isEmpty()) {
      return null
    }
    return this._head!.entity
  }

  public isEmpty() {
    return this.size() === 0
  }
}
