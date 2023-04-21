import React, { useState } from 'react'
import { Tag } from 'antd'
import { TagProps } from 'antd/es/tag'

interface Props {
  values: (string | number | any)[]
  describeFunc?: (value: string | number | any) => string
  width?: string
  inline?: boolean
  tagProps?: TagProps
  thin?: boolean
}

export const MyTagsPanel: React.FC<Props> = (props) => {
  const [isThin, setThin] = useState(props.thin || false)

  let options = (props.values || []).map((value) => {
    return {
      label: props.describeFunc ? props.describeFunc(value) : `${value}`,
      value: value,
    }
  })
  const showEllipsis = isThin && options.length > 3
  if (showEllipsis) {
    options = options.slice(0, 3)
  }
  return (
    <div style={{ width: props.width || 'auto' }}>
      {options.map((option) => {
        return (
          <div key={option.value} style={{ display: props.inline ? 'inline-block' : 'block' }}>
            <Tag
              {...(props.tagProps || {})}
              style={{
                whiteSpace: 'normal',
              }}
            >
              {option.label}
            </Tag>
          </div>
        )
      })}
      {showEllipsis && (
        <div style={{ display: props.inline ? 'inline-block' : 'block' }}>
          <Tag
            {...(props.tagProps || {})}
            style={{
              whiteSpace: 'normal',
              cursor: 'pointer',
            }}
            onClick={() => {
              setThin(false)
            }}
          >
            ...
          </Tag>
        </div>
      )}
    </div>
  )
}
