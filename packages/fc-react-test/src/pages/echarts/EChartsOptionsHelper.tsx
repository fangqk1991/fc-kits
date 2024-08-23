import { AxisPointerComponentOption, SeriesOption, TooltipComponentOption, XAXisComponentOption } from 'echarts'

export type EchartsSeriesOption = SeriesOption & { name: string }

export class EChartsOptionsHelper {
  public static makeTimeXAxis(timeList: string[], extras: Partial<XAXisComponentOption> = {}): XAXisComponentOption {
    return {
      type: 'category',
      data: timeList,
      // boundaryGap: false,
      axisLine: { onZero: false },
      splitLine: { show: false },
      min: 'dataMin',
      max: 'dataMax',
      axisPointer: {
        z: 100,
      },
      ...((extras || {}) as any),
    }
  }

  public static makeAxisPointer(): AxisPointerComponentOption {
    return {
      link: [
        {
          xAxisIndex: 'all',
        },
      ],
      label: {
        backgroundColor: '#777',
      },
    }
  }

  public static makeTooltip(): TooltipComponentOption {
    return {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
      borderWidth: 1,
      borderColor: '#ccc',
      padding: 10,
      textStyle: {
        color: '#000',
      },
    }
  }
}
