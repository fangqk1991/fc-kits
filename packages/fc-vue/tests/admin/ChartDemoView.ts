import { Component, ViewController } from '../../src'
import { MyPieChart, PieChartData } from '../../echarts/MyPieChart'
import { LineChartData, MyBarChart, MyLineChart } from '../../echarts'

@Component({
  components: {
    'my-pie-chart': MyPieChart,
    'my-line-chart': MyLineChart,
    'my-bar-chart': MyBarChart,
  },
  template: `
    <div>
      <h4>Charts</h4>
      <el-tabs type="card" class="mt-4" value="line-chart">
        <el-tab-pane label="Pie Chart" name="pie-chart">
          <my-pie-chart :data="pieChartData" height="700px" />
        </el-tab-pane>
        <el-tab-pane label="Line Chart" name="line-chart">
          <my-line-chart :data="lineChartData" height="700px" />
          <el-button size="mini" @click="onRandom()">Random</el-button>
        </el-tab-pane>
        <el-tab-pane label="Bar Chart" name="bar-chart">
          <my-bar-chart :data="lineChartData" height="700px" />
          <el-button size="mini" @click="onRandom()">Random</el-button>
        </el-tab-pane>
      </el-tabs>
    </div>
  `,
})
export class ChartDemoView extends ViewController {
  pieChartData: PieChartData = {
    title: 'Traffic Sources',
    items: [
      { value: 335, name: 'Direct' },
      { value: 310, name: 'Email' },
      { value: 234, name: 'Ad Networks' },
      { value: 135, name: 'Video Ads' },
      { value: 1548, name: 'Search Engines' },
    ],
    labelFormat: (name) => {
      return `[${name}]`
    },
    onClick: (params) => {
      this.$message.success(`Click "${params.name}" - (${params.value})`)
    },
  }

  lineChartData: LineChartData = {
    onClick: (params) => {
      this.$message.success(`Click "${params.seriesName}" - (${params.xValue}, ${params.yValue})`)
    },
    toolbox: {
      feature: {
        saveAsImage: {},
      },
    },
    title: 'Some items',
    xAxisValues: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    xAxisLabelFormat: (val) => {
      return `#${val}#`
    },
    legendCheckedMap: {
      Email: true,
      'Search Engine': false,
    },
    legends: [
      {
        name: 'Email',
        data: {
          Mon: 120,
          Tue: 132,
          Wed: 101,
          Thu: 134,
          Fri: 90,
          Sat: 230,
          Sun: 210,
        },
      },
      {
        name: 'Union Ads',
        data: {
          Mon: 220,
          Tue: 182,
          Wed: 191,
          Thu: 234,
          Fri: 290,
          Sat: 330,
          Sun: 310,
        },
      },
      {
        name: 'Video Ads',
        data: {
          Mon: 150,
          Tue: 232,
          Wed: 201,
          Thu: 154,
          Fri: 190,
          Sat: 330,
          Sun: 410,
        },
      },
      {
        name: 'Direct',
        data: {
          Mon: 320,
          Tue: 332,
          Wed: 301,
          Thu: 334,
          Fri: 390,
          Sat: 330,
          Sun: 320,
        },
      },
      {
        name: 'Search Engine',
        data: {
          Mon: 820,
          Tue: 932,
          Wed: 901,
          Thu: 934,
          Fri: 1290,
          Sat: 1330,
          Sun: 1320,
        },
        lineStyle: {
          type: 'dashed',
        },
      },
    ],
  }

  onRandom() {
    this.lineChartData.legends.forEach((item) => {
      Object.keys(item.data).forEach((key) => {
        item.data[key] = `${Math.floor(Math.random() * 100)}`
      })
    })
  }
}
