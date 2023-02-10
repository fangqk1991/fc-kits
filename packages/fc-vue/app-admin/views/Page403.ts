import { Component, Prop, ViewController } from '../../src'

@Component({})
export class Page403 extends ViewController {
  @Prop({ default: '', type: String }) readonly permissionKey!: string

  viewDidLoad() {}

  render(createElement: any) {
    if (this.$app.config.view403) {
      return createElement('div', [
        createElement(this.$app.config.view403, {
          props: {
            permissionKey: this.permissionKey,
          },
        }),
      ])
    }
    return createElement('h2', `Permission denied. [${this.permissionKey}]`)
  }
}
