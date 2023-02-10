import '../fangcha/fc-styles.scss'
import { BasicApp } from '../app'
import { AppView } from './AppView'

new BasicApp({
  appName: 'Fangcha Test',
  routes: [
    {
      path: '/',
      component: AppView,
    },
  ],
}).launch()
