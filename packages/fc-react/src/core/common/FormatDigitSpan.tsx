import React, { HTMLAttributes } from 'react'
import { Tooltip } from 'antd'

interface Props extends HTMLAttributes<any> {
  mode?: 'normal' | 'profit' | 'raw'
  valueThresholdForColor?: number
  usingPercent?: boolean
  usingComma?: boolean
  color?: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number
  fractionDigits?: number
  usingThreshold?: number
  useTooltip?: boolean
  value: number
}

export const FormatDigitSpan: React.FC<Props> = ({
  value,
  usingPercent,
  usingComma,
  fractionDigits,
  usingThreshold,
  valueThresholdForColor,
  ...props
}) => {
  let color = props.color || ''
  if (props.mode === 'profit' || valueThresholdForColor !== undefined) {
    valueThresholdForColor = valueThresholdForColor || 0
    color = '#888888'
    if (value > valueThresholdForColor) {
      color = '#28a745'
    } else if (value < valueThresholdForColor) {
      color = '#dc3545'
    }
  }
  const element = (
    <span
      {...props}
      style={{
        ...props.style,
        color: color,
        fontWeight: props.fontWeight,
      }}
    >
      {(() => {
        if (props.mode === 'raw') {
          return value
        } else {
          let prefix = value < 0 ? '-' : ''
          if (!prefix && props.mode && props.mode.startsWith('profit')) {
            prefix = '+'
          }
          if (fractionDigits === undefined) {
            fractionDigits = 2
          }
          let val = Math.abs(value)
          let unit
          if (!usingComma && (!usingThreshold || val >= usingThreshold)) {
            const units = ['', 'K', 'M', 'B', 'T', 'E15', 'E18', 'E21', 'E24', 'E27', 'E30']
            let usingUnits = [...units]
            // billion, trillion, quadrillion, quintillion, sextillion, septillion
            while ((unit = usingUnits.shift()) !== undefined && val >= 1000) {
              val = val / 1000
            }
            if (unit === undefined) {
              unit = units[units.length - 1]
            }
          }
          unit = unit || ''
          return (
            <>
              {prefix}
              {(() => {
                if (usingComma) {
                  return Number(val.toFixed(fractionDigits)).toLocaleString()
                }
                return usingPercent
                  ? `${(val * 100).toFixed(fractionDigits)}${unit}%`
                  : `${val.toFixed(fractionDigits)}${unit}`
              })()}
            </>
          )
        }
      })()}
    </span>
  )
  if (props.useTooltip) {
    return <Tooltip title={<span>{value}</span>}>{element}</Tooltip>
  }
  return element
}
