import React, { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<any> {
  mode?: 'normal' | 'profit' | 'raw'
  usingPercent?: boolean
  color?: string
  fontWeight?: 'normal' | 'bold' | 'lighter' | 'bolder' | number
  fractionDigits?: number
  usingThreshold?: number
  value: number
}

export const FormatDigitSpan: React.FC<Props> = ({ value, usingPercent, fractionDigits, usingThreshold, ...props }) => {
  let color = props.color || ''
  if (props.mode === 'profit') {
    color = '#888888'
    if (value > 0) {
      color = '#28a745'
    } else if (value < 0) {
      color = '#dc3545'
    }
  }
  return (
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
          if (usingThreshold && val >= usingThreshold) {
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
              {usingPercent
                ? `${(val * 100).toFixed(fractionDigits)}${unit}%`
                : `${val.toFixed(fractionDigits)}${unit}`}
            </>
          )
        }
      })()}
    </span>
  )
}
