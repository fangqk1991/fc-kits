import React from 'react'
import { TypicalColumn } from '@fangcha/tools/src/excel'
import { Divider, message, Space } from 'antd'
import { ExcelPickButton, HotExcelPanel } from '@fangcha/react-excel'

interface DataProps {
  aaa: any
  bbb: any
}

const columns: TypicalColumn<DataProps>[] = [
  {
    columnKey: 'aaa',
    columnName: 'AAA',
  },
  {
    columnKey: 'bbb',
    columnName: 'BBB',
  },
]

export const TestExcelsView: React.FC = () => {
  return (
    <div>
      <HotExcelPanel
        tmplFileName={'模板文件.xlsx'}
        columns={columns}
        onPickRecords={(records) => {
          message.success(JSON.stringify(records))
        }}
      />
      <Divider />
      <Space>
        <ExcelPickButton
          onPickRecords={(records) => {
            message.warning(JSON.stringify(records))
          }}
        >
          Custom Excel
        </ExcelPickButton>
      </Space>
    </div>
  )
}
