import React from 'react'
import { TypicalColumn } from '@fangcha/tools/lib/excel'
import { Divider, message, Space } from 'antd'
import { ExcelPickButton, HotExcelPanel } from '@fangcha/excel-react'

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
        tmplDownloadBtnText={'模板下载'}
        tmplDemoRecords={[{ aaa: 1, bbb: 2 }]}
        importBtnText={'Excel 导入'}
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
