import React from 'react'
import { Button, Divider, message, Space } from 'antd'
import {
  ConfirmDialog,
  JsonEditorDialog,
  ReactDialogTheme,
  SimpleInputDialog,
  SimplePickerDialog,
  TextPreviewDialog,
} from '@fangcha/react'
import { sleep } from '@fangcha/tools'

export const TestDialogsView: React.FC = () => {
  ReactDialogTheme.colorPrimary = 'rgb(221 115 164)'

  return (
    <>
      <Space>
        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new ConfirmDialog({
              title: 'Confirm Title',
              content: '这是一条确认信息',
            })
            dialog.show(() => {
              message.success('已点击「确认」')
            })
          }}
        >
          ConfirmDialog
        </Button>

        <Button
          onClick={() => {
            const dialog = new SimpleInputDialog({
              title: 'SimpleInputDialog Title',
              curValue: `${Math.random()}`,
            })
            dialog.show((value) => {
              message.success(`提交 ${value}`)
            })
          }}
        >
          SimpleInputDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new SimplePickerDialog({
              options: [
                {
                  label: 'A',
                  value: 'A',
                },
                {
                  label: 'B',
                  value: 'B',
                },
              ],
            })
            dialog.show((value) => {
              message.success(`提交 ${value}`)
            })
          }}
        >
          SimplePickerDialog
        </Button>

        <Button
          onClick={() => {
            TextPreviewDialog.previewData({
              a: Math.random(),
              abc: {
                a: Math.random(),
                b: Math.random(),
                c: Math.random(),
              },
            })
          }}
        >
          TextPreviewDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new JsonEditorDialog({
              curValue: {
                a: Math.random(),
                abc: {
                  a: Math.random(),
                  b: Math.random(),
                  c: Math.random(),
                },
              },
            })
            dialog.show((value) => {
              message.success(`提交 ${JSON.stringify(value, null, 2)}`)
            })
          }}
        >
          JsonEditorDialog
        </Button>
      </Space>
      <Divider />
      <Space>
        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new ConfirmDialog({
              title: 'Confirm Title',
              content: '这是一条确认信息',
            })
            dialog.show(async () => {
              message.info('等待 2s...')
              await sleep(2000)
              message.success('已点击「确认」')
            })
          }}
        >
          Dialog Submitting
        </Button>

        <Button
          onClick={() => {
            TextPreviewDialog.loadDataAndPreview(async () => {
              await sleep(2000)
              return {
                a: Math.random(),
                abc: {
                  a: Math.random(),
                  b: Math.random(),
                  c: Math.random(),
                },
              }
            })
          }}
        >
          TextPreviewDialog.loadData
        </Button>
      </Space>
    </>
  )
}
