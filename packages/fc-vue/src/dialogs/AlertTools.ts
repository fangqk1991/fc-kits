import { MessageBox } from 'element-ui'

export class AlertTools {
  public static async showAlert(content: string, title?: string) {
    return MessageBox.alert(content, title || 'Info', {
      confirmButtonText: '关闭',
      showClose: false,
    })
  }

  public static async showConfirm(content: string, title?: string) {
    return MessageBox.alert(content, title || 'Info', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
    })
  }
}
