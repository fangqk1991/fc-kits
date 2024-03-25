import React, { HTMLAttributes } from 'react'

interface Props extends HTMLAttributes<any> {
  pure?: boolean
  value: number
}

export const PercentSpan: React.FC<Props> = ({ value, pure, ...props }) => {
  const valueText = `${(value * 100).toFixed(2)}%`
  if (pure) {
    return <b {...props}>{valueText}</b>
  }
  if (value > 0) {
    return (
      <b
        {...props}
        style={{
          color: '#28a745',
          ...(props.style || {}),
        }}
      >
        +{valueText}
      </b>
    )
  } else if (value < 0) {
    return (
      <b
        {...props}
        style={{
          color: '#dc3545',
          ...(props.style || {}),
        }}
      >
        {valueText}
      </b>
    )
  } else {
    return <b {...props}>{valueText}</b>
  }
}
