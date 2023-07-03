import React, { useState } from 'react'
import { DatePicker, Divider, message, Space } from 'antd'
import { ProForm, ProFormDatePicker } from '@ant-design/pro-components'
import * as dayjs from 'dayjs'
import * as moment from 'moment'

export const TestFormsView: React.FC = () => {
  const [month, setMonth] = useState('')
  return (
    <div>
      <div>
        <h4>AntD DatePickers</h4>
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
      </div>
      <Divider />
      <div>
        <ProForm>
          <ProFormDatePicker
            label={'Month Picker'}
            fieldProps={{
              value: dayjs(month || moment().format('YYYY-MM')),
              picker: 'month',
              format: 'YYYY-MM',
              allowClear: false,
              onChange: (date, dateString) => {
                setMonth(dateString)
                message.success(`year picker: ${dateString}`)
              },
            }}
          />
        </ProForm>
      </div>
    </div>
  )
}
