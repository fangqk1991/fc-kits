import React from 'react'
import { DatePicker, message, Space } from 'antd'

export const TestFormsView: React.FC = () => {
  return (
    <Space>
      <DatePicker
        onChange={(date, dateString) => {
          message.success(`date picker: ${dateString}`)
        }}
      />
      <DatePicker
        onChange={(date, dateString) => {
          message.success(`month picker: ${dateString}`)
        }}
        picker='month'
      />
      <DatePicker
        onChange={(date, dateString) => {
          message.success(`quarter picker: ${dateString}`)
        }}
        picker='quarter'
      />
      <DatePicker
        onChange={(date, dateString) => {
          message.success(`year picker: ${dateString}`)
        }}
        picker='year'
      />
    </Space>
  )
}
