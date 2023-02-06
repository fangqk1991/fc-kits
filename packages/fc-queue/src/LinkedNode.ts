export class LinkedNode<T> {
  public entity: T
  public next: LinkedNode<T> | null

  constructor(obj: T) {
    this.entity = obj
    this.next = null
  }
}
