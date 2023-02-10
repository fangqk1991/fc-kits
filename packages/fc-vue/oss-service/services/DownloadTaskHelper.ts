import { MessageBox } from 'element-ui'
import { OssRouteData } from './OssRouteData'
import { ResourceTaskModel, ResourceTaskStatus } from '@fangcha/oss-service/lib/common/models'

export class DownloadTaskHelper {
  public static handleDownloadResponse(response: ResourceTaskModel) {
    switch (response.taskStatus) {
      case ResourceTaskStatus.Pending:
      case ResourceTaskStatus.Processing: {
        MessageBox.alert(
          `任务已提交，生成完毕后可在 <a href="${OssRouteData.ResourceTaskListView.path}" target="_blank">我的下载</a> 中进行下载`,
          {
            confirmButtonText: '关闭',
            dangerouslyUseHTMLString: true,
            showClose: false,
          }
        )
        break
      }
      case ResourceTaskStatus.Success: {
        window.open(response.downloadUrl)
        break
      }
      case ResourceTaskStatus.Fail: {
        MessageBox.alert(`生成失败，请重新生成`, {
          confirmButtonText: '关闭',
          showClose: false,
        })
        break
      }
    }
  }
}
