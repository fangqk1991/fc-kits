import { EChartsOption, XAXisComponentOption } from 'echarts'
import { DataZoomComponentOption, GridComponentOption, YAXisComponentOption } from 'echarts/types/dist/echarts'
import { BoxLayoutOptionMixin } from 'echarts/types/src/util/types'
import { EChartsOptionsHelper, EchartsSeriesOption } from './EChartsOptionsHelper'

interface ChartBuilderParams {
  timeList: string[]
  mainSeriesOptionList: EchartsSeriesOption[]
  defaultZoom?: 'none' | 'end'
  defaultZoomRange?: [number, number]
  showZoomSlider?: boolean
  xAxisOptions?: Partial<XAXisComponentOption>
}

export class EChartOptionBuilder {
  public readonly isMobile: boolean
  public readonly timeList: string[]
  public readonly grids: ChartGridBuilder[]

  public readonly params: ChartBuilderParams

  public constructor(params: ChartBuilderParams) {
    this.isMobile = window.innerWidth < 768
    this.params = params
    this.timeList = params.timeList
    this.grids = []
    this.addMainGrid()
  }

  public get mainGrid() {
    return this.grids[0]
  }

  public get height() {
    const grids = this.getGrids()
    const lastGrid = grids[grids.length - 1]
    return lastGrid.top + lastGrid.height + 10 + (this.params.showZoomSlider ? 60 : 0)
  }

  private addMainGrid() {
    const mainGrid = this.addGrid()
    const [firstItem, ...otherItems] = this.params.mainSeriesOptionList
    mainGrid.addSeries(firstItem)
    if (otherItems.length > 0) {
      mainGrid.addYAxisAndSeries({}, ...otherItems)
    }
    return mainGrid
  }

  public addGrid() {
    const grid = new ChartGridBuilder(this.timeList, this.params.xAxisOptions)
    this.grids.push(grid)
    return grid
  }

  public getXAxisItems() {
    return this.grids.map((item, index) => ({
      ...item.xAxis,
      gridIndex: index,
    }))
  }

  public getYAxisItems() {
    return this.grids.reduce(
      (result, cur, index) =>
        result.concat(
          cur.yAxisItems.map((item) => ({
            ...item,
            gridIndex: index,
          }))
        ),
      [] as YAXisComponentOption[]
    )
  }

  public getSeriesItems() {
    let startY = 0
    const seriesItems: EchartsSeriesOption[] = []
    for (let gridIndex = 0; gridIndex < this.grids.length; ++gridIndex) {
      const grid = this.grids[gridIndex]
      for (let seriesIndex = 0; seriesIndex < grid.seriesItems.length; ++seriesIndex) {
        const series = grid.seriesItems[seriesIndex]
        series['xAxisIndex'] = gridIndex
        series['yAxisIndex'] = (series['yAxisIndex'] || 0) + startY
        seriesItems.push(series)
      }
      startY += grid.yAxisItems.length
    }
    return seriesItems
  }

  public getGrids(): (BoxLayoutOptionMixin & { top: number; height: number })[] {
    const topGap = 30
    const midGap = 30
    if (this.grids.length > 1) {
      let left = '45'
      let right = '5%'
      let mainHeight = 360
      let assistantHeight = 80
      if (this.isMobile) {
        left = '36'
        right = '15'
        mainHeight = 220
      }
      const rects: (BoxLayoutOptionMixin & { top: number; height: number })[] = [
        { left: left, right: right, top: topGap, height: mainHeight },
      ]
      let prevBottom = topGap + mainHeight
      for (let i = 1; i < this.grids.length; ++i) {
        rects.push({ left: left, right: right, top: prevBottom + midGap, height: assistantHeight })
        prevBottom += assistantHeight + midGap
      }
      return rects
    }
    return [
      {
        left: '0',
        right: '0',
        top: topGap,
        height: this.isMobile ? Math.floor(window.innerWidth * 0.5) : 600,
        containLabel: true,
      },
    ]
  }

  public build(): EChartsOption & {
    height: number
    grid: GridComponentOption[]
    xAxis: XAXisComponentOption[]
    yAxis: YAXisComponentOption[]
    series: EchartsSeriesOption[]
  } {
    const seriesItems = this.getSeriesItems()
    const xAxisItems = this.getXAxisItems()
    const grids = this.getGrids()
    let zoomRange: [any, any] = [undefined, undefined]
    if (this.params.defaultZoomRange) {
      zoomRange = [
        Math.floor((this.params.defaultZoomRange[0] / this.timeList.length) * 100),
        Math.floor((this.params.defaultZoomRange[1] / this.timeList.length) * 100),
      ]
    } else if (this.params.defaultZoom !== 'none') {
      zoomRange = [Math.floor(100 - (Math.min(100, this.timeList.length) / this.timeList.length) * 100), 100]
    }
    const dataZoomItems: DataZoomComponentOption[] = [
      {
        type: 'inside',
        xAxisIndex: xAxisItems.map((_, index) => index),
        start: zoomRange[0],
        end: zoomRange[1],
      },
    ]
    if (this.params.showZoomSlider) {
      dataZoomItems.push({
        show: true,
        xAxisIndex: [0, 1],
        type: 'slider',
        top: grids[grids.length - 1].top + grids[grids.length - 1].height + 30,
        start: zoomRange[0],
        end: zoomRange[1],
      })
    }
    return {
      height: this.height,
      animation: false,
      legend: {
        top: 0,
        left: 'center',
        data: seriesItems.filter((item) => item.type !== 'custom').map((item) => item.name),
      },
      // toolbox: {
      //   itemSize: 18,
      //   left: 40,
      //   feature: {
      //     myTool1: {
      //       show: true,
      //       title: '自定义扩展方法1',
      //       // icon: 'path://M432.45,595.444c0,2.177-4.661,6.82-11.305,6.82c-6.475,0-11.306-4.567-11.306-6.82s4.852-6.812,11.306-6.812C427.841,588.632,432.452,593.191,432.45,595.444L432.45,595.444z M421.155,589.876c-3.009,0-5.448,2.495-5.448,5.572s2.439,5.572,5.448,5.572c3.01,0,5.449-2.495,5.449-5.572C426.604,592.371,424.165,589.876,421.155,589.876L421.155,589.876z M421.146,591.891c-1.916,0-3.47,1.589-3.47,3.549c0,1.959,1.554,3.548,3.47,3.548s3.469-1.589,3.469-3.548C424.614,593.479,423.062,591.891,421.146,591.891L421.146,591.891zM421.146,591.891',
      //       onclick: () => {
      //         alert('myToolHandler1')
      //       },
      //     },
      //   },
      // },
      tooltip: EChartsOptionsHelper.makeTooltip(),
      axisPointer: EChartsOptionsHelper.makeAxisPointer(),
      dataZoom: dataZoomItems,
      grid: grids,
      xAxis: xAxisItems,
      yAxis: this.getYAxisItems(),
      series: seriesItems,
    }
  }

  public static buildOptions(options: ChartBuilderParams) {
    return new EChartOptionBuilder(options).build()
  }
}

class ChartGridBuilder {
  timeList: string[]
  seriesItems: EchartsSeriesOption[]
  xAxis: XAXisComponentOption
  yAxisItems: YAXisComponentOption[]

  public constructor(timeList: string[], xAxisOptions: Partial<XAXisComponentOption> = {}) {
    this.timeList = timeList
    this.seriesItems = []
    this.xAxis = EChartsOptionsHelper.makeTimeXAxis(timeList, xAxisOptions)
    this.yAxisItems = [
      {
        scale: true,
        splitArea: {
          show: true,
        },
      },
    ]
  }

  public addSeries(series: EchartsSeriesOption) {
    this.seriesItems.push({
      type: 'line',
      smooth: true,
      showSymbol: false,
      ...series,
    } as EchartsSeriesOption)
  }

  public addYAxisAndSeries(yAxis: YAXisComponentOption, ...seriesItems: EchartsSeriesOption[]) {
    this.yAxisItems.push({
      scale: true,
      splitArea: {
        show: false,
      },
      splitLine: {
        show: false,
      },
      ...yAxis,
    })
    this.seriesItems.push(
      ...seriesItems.map(
        (item) =>
          ({
            type: 'line',
            smooth: true,
            showSymbol: false,
            yAxisIndex: this.yAxisItems.length - 1,
            ...item,
          } as EchartsSeriesOption)
      )
    )
  }
}
