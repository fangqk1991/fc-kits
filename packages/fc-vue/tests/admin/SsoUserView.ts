import { Component, JsonPre, ViewController } from '../../src'
import { SessionHTTP } from '../../basic'
import { KitAuthApis } from '@fangcha/backend-kit/lib/apis'

@Component({
  components: {
    'json-pre': JsonPre,
  },
  template: `
    <div class="p-5">
      <h2>User</h2>
      <json-pre :value="data" />
      <el-button class="mt-4" size="mini" @click="onClickLogout">Logout</el-button>
    </div>
  `,
})
export class SsoUserView extends ViewController {
  data: any = null

  async viewDidLoad() {
    this.data = await SessionHTTP.getUserInfo()
  }

  onClickLogout() {
    window.location.href = KitAuthApis.RedirectLogout.route
  }
}
