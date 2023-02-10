import { Component, ViewController } from '..'

@Component({
  template: `
    <el-container class="fc-theme" style="height: 100vh; overflow-x: hidden; overflow-y: auto;">
      <el-header class="app-header">
        <div class="title-wrapper">
          <div class="title">{{ $app.appName() }}</div>
        </div>
      </el-header>
      <el-container>
        <el-main></el-main>
      </el-container>
    </el-container>
  `,
})
export class AppView extends ViewController {}
