export const DownloadApis = {
  ResourceTaskPageDataGet: {
    method: 'GET',
    route: '/api/v0/oss/resource-task',
    description: '获取任务列表',
  },
  ResourceTaskRetry: {
    method: 'POST',
    route: '/api/v0/oss/resource-task/:taskKey/retry',
    description: '重试任务',
  },
}
