import React, { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<any> {
  value: number
}

export const PercentSpan: React.FC<Props> = ({ value, ...props }) => {
  const valueText = `${(value * 100).toFixed(2)}%`
  if (value > 0) {
    return (
      <b style={{ color: '#28a745' }} {...props}>
        +{valueText}
      </b>
    )
  } else if (value < 0) {
    return (
      <b style={{ color: '#dc3545' }} {...props}>
        {valueText}
      </b>
    )
  } else {
    return <b {...props}>{valueText}</b>
  }
}
