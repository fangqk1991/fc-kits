import { RouteConfig } from 'vue-router'
import { ResourceTaskListView } from '../views/ResourceTaskListView'

export const OssRouteData = {
  ResourceTaskListView: {
    path: '/oss-sdk/v1/resource-task',
    component: ResourceTaskListView,
    name: 'OssSDK_ResourceTaskListView',
  } as RouteConfig,
}
