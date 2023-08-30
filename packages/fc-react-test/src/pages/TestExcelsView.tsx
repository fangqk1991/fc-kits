import React from 'react'
import { Divider, message, Space } from 'antd'
import { ExcelPickButton, HotExcelPanel } from '@fangcha/excel-react'
import { TypicalColumn } from '@fangcha/excel'
import { sleep } from '@fangcha/tools'

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
        onPickExcel={(excel) => {
          message.success(JSON.stringify(excel.records()))
        }}
      />
      <Divider />
      <Space>
        <ExcelPickButton
          onPickExcel={async (excel) => {
            await sleep(1000)
            message.warning(JSON.stringify(excel.records()))
          }}
        >
          Pick Excel & Preview
        </ExcelPickButton>
        <ExcelPickButton
          skipPreview={true}
          onPickExcel={async (excel) => {
            await sleep(1000)
            message.warning(JSON.stringify(excel.records()))
          }}
        >
          Pick Excel without Preview
        </ExcelPickButton>
      </Space>
    </div>
  )
}
