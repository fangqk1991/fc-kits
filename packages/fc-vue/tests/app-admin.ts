import { AdminApp } from '../app-admin'
import { Red_View } from './admin/Red_View'
import { Blue_View } from './admin/Blue_View'
import { I18nCode, sleep, VisitorInfo } from '@fangcha/tools'
import { HomeView } from './admin/HomeView'
import { DialogDemoView } from './admin/DialogDemoView'
import { TableDemoView } from './table/TableDemoView'
import '../fangcha/fc-styles.scss'
import { GridDemoView } from './table/GridDemoView'
import { BootstrapDemoView } from './admin/BootstrapDemoView'
import { WidgetsDemoView } from './admin/WidgetsDemoView'
import { Green_View } from './admin/Green_View'
import { VisibleLevel } from '../src/sidebars'
import { TextEditorDemoView } from './admin/TextEditorDemoView'
import { LoadingView } from '../src/loading'
import { ChartDemoView } from './admin/ChartDemoView'

const app = new AdminApp({
  appName: 'Fangcha Admin',
  homeView: HomeView,
  useRemoteLocale: false,
  profileViewUrl: '/v1/profile',
  style: {
    appHeader: {
      background: '#DD73A4',
    },
  },
  appDidLoad: async () => {
    await sleep(1000)
  },
  sidebarNodes: [
    {
      titleEn: 'Permission',
      titleZh: 'Permission',
      icon: 'el-icon-user',
      links: [
        {
          titleEn: 'Red',
          titleZh: 'Red',
          path: '/v1/page-red',
        },
        {
          titleEn: 'onClick',
          titleZh: 'onClick',
          onClick: () => {
            LoadingView.loadHandler('Loading..........', async () => {
              await sleep(2000)
            })
          },
        },
        {
          titleEn: 'Green',
          titleZh: 'Green',
          path: '/v1/page-green',
          visibleLevel: VisibleLevel.Private,
        },
        {
          titleEn: 'Blue',
          titleZh: 'Blue',
          path: '/v1/page-blue',
        },
      ],
    },
    {
      titleEn: 'Permission 2',
      titleZh: 'Permission 2',
      icon: 'el-icon-user',
      links: [
        {
          titleEn: 'Green',
          titleZh: 'Green',
          path: '/v1/page-green',
          visibleLevel: VisibleLevel.Private,
        },
      ],
    },
    {
      titleEn: 'Permission 3',
      titleZh: 'Permission 3',
      icon: 'el-icon-user',
      visible: () => false,
      links: [
        {
          titleEn: 'Green',
          titleZh: 'Green',
          path: '/v1/page-green',
        },
      ],
    },
    {
      titleEn: 'Components',
      titleZh: 'Components',
      icon: 'el-icon-menu',
      links: [
        {
          titleEn: 'Dialogs',
          titleZh: 'Dialogs',
          path: '/v1/dialog-demo',
        },
        {
          titleEn: 'TableView Demo',
          titleZh: 'TableView Demo',
          path: '/v1/table-view-demo',
        },
        {
          titleEn: 'GridView Demo',
          titleZh: 'GridView Demo',
          path: '/v1/grid-view-demo',
        },
        {
          titleEn: 'Widgets Demo',
          titleZh: 'Widgets Demo',
          path: '/v1/widgets-demo',
        },
        {
          titleEn: 'Bootstrap Demo',
          titleZh: 'Bootstrap Demo',
          path: '/v1/bootstrap-demo',
        },
        {
          titleEn: 'TextEditor Demo',
          titleZh: 'TextEditor Demo',
          path: '/v1/text-editor-demo',
        },
        {
          titleEn: 'Chart Demo',
          titleZh: 'Chart Demo',
          path: '/v1/chart-demo',
        },
      ],
    },
    {
      uid: 'menu',
      titleEn: 'AppMenu',
      titleZh: 'AppMenu',
      icon: 'el-icon-user',
      links: [
        {
          titleEn: 'onClick',
          titleZh: 'onClick',
          onClick: () => {
            const randomNum = Math.floor(Math.random() * 10)
            app.updateMenu('menu', {
              titleEn: `Menu - ${randomNum}`,
              titleZh: `Menu - ${randomNum}`,
            })
          },
        },
      ],
    },
  ],
  routes: [
    {
      path: '/v1/page-red',
      require: 'Red',
      component: Red_View,
    },
    {
      path: '/v1/page-green',
      require: 'Green',
      component: Green_View,
    },
    {
      path: '/v1/page-blue',
      require: 'Blue',
      component: Blue_View,
    },
    {
      path: '/v1/dialog-demo',
      component: DialogDemoView,
    },
    {
      path: '/v1/table-view-demo',
      component: TableDemoView,
    },
    {
      path: '/v1/grid-view-demo',
      component: GridDemoView,
    },
    {
      path: '/v1/widgets-demo',
      component: WidgetsDemoView,
    },
    {
      path: '/v1/bootstrap-demo',
      component: BootstrapDemoView,
    },
    {
      path: '/v1/text-editor-demo',
      component: TextEditorDemoView,
    },
    {
      path: '/v1/chart-demo',
      component: ChartDemoView,
    },
  ],
  reloadUserInfo: async (): Promise<VisitorInfo> => {
    return {
      iamId: 0,
      email: 'xxx@email.com',
      name: 'Fangcha',
      permissionKeyMap: {
        Red: 1,
      },
      isAdmin: true,
      locale: I18nCode.en,
    }
  },
})
app.launch()
