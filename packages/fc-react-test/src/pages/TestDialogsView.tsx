import React from 'react'
import { Button, Divider, message, Space, Tag } from 'antd'
import {
  ConfirmDialog,
  FlexibleFormDialog,
  InformationDialog,
  JsonEditorDialog,
  MessageDialog,
  MultiplePickerDialog,
  ReactPreviewDialog,
  SimpleInputDialog,
  SimplePickerDialog,
  TextPreviewDialog,
} from '@fangcha/react'
import { sleep } from '@fangcha/tools'
import { ProFormDigit, ProFormRadio, ProFormText, ProFormTextArea } from '@ant-design/pro-components'

export const TestDialogsView: React.FC = () => {
  return (
    <>
      <Space>
        <Button
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
          type={'primary'}
          onClick={() => {
            const dialog = new ConfirmDialog({
              title: 'Confirm Title',
              content: '这是一条确认信息',
              forceVerify: true,
            })
            dialog.show(() => {
              message.success('已点击「确认」')
            })
          }}
        >
          ConfirmDialog.strong
        </Button>

        <Button
          onClick={() => {
            const dialog = new SimpleInputDialog({
              title: 'SimpleInputDialog Title',
              curValue: `${Math.random()}`,
            })
            dialog.show(async (value) => {
              await sleep(1000)
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
              curValue: 'A',
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
            // dialog.forceUsing = 'Select'
            dialog.show((value) => {
              message.success(`提交 ${value}`)
            })
          }}
        >
          SimplePickerDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new MultiplePickerDialog({
              options: [
                {
                  label: `A: ${Math.random()}`,
                  value: 'A',
                },
                {
                  label: `B: ${Math.random()}`,
                  value: 'B',
                },
                {
                  label: `C: ${Math.random()}`,
                  value: 'C',
                },
              ],
              checkedList: ['B'],
            })
            dialog.show((value) => {
              message.success(`提交 ${JSON.stringify(value)}`)
            })
          }}
        >
          MultiplePickerDialog
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

        <Button
          onClick={() => {
            InformationDialog.previewData({
              title: `${Math.random()}`,
              infos: [
                {
                  label: 'A',
                  value: Math.random(),
                },
                {
                  label: 'B',
                  render: () => <Tag color={'red'}>{Math.random()}</Tag>,
                },
                {
                  label: 'C',
                  value: Math.random(),
                },
                {
                  label: 'D',
                  value: Math.random(),
                },
                {
                  label: 'E',
                  value: Math.random(),
                },
              ],
            })
          }}
        >
          InformationDialog
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

        <Button
          type={'primary'}
          onClick={() => {
            ReactPreviewDialog.preview(<Tag color={'error'}>ReactPreviewDialog</Tag>)
          }}
        >
          ReactPreviewDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            ReactPreviewDialog.asyncPreview(async () => {
              await sleep(2000)
              return <Tag color={'error'}>ReactPreviewDialog</Tag>
            })
          }}
        >
          ReactPreviewDialog.async
        </Button>

        <Button
          onClick={() => {
            MessageDialog.alert(<Tag color={'geekblue'}>MessageDialog.alert</Tag>)
          }}
        >
          MessageDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new FlexibleFormDialog({
              formBody: (
                <>
                  <ProFormDigit name={'number'} label={'Number'} />
                  <ProFormText name={'text'} label={'Text'} />
                  <ProFormTextArea
                    name={'textArea'}
                    label={'TextArea'}
                    fieldProps={{
                      rows: 3,
                    }}
                  />
                  <ProFormRadio.Group
                    name={'radio'}
                    label={'Radio'}
                    options={[
                      {
                        label: 'Radio 1',
                        value: 1,
                      },
                      {
                        label: 'Radio 2',
                        value: 2,
                      },
                    ]}
                    radioType='button'
                  />
                </>
              ),
              placeholder: {
                number: 1,
              },
            })
            dialog.show(async (params) => {
              message.info(JSON.stringify(params))
            })
          }}
        >
          FlexibleFormDialog
        </Button>

        <Button
          type={'primary'}
          onClick={() => {
            const dialog = new FlexibleFormDialog({
              formBody: (
                <>
                  <ProFormDigit name={'number'} label={'Number'} />
                  <ProFormText name={'text'} label={'Text'} />
                  <ProFormTextArea
                    name={'textArea'}
                    label={'TextArea'}
                    fieldProps={{
                      rows: 3,
                    }}
                  />
                  <ProFormRadio.Group
                    name={'radio'}
                    label={'Radio'}
                    options={[
                      {
                        label: 'Radio 1',
                        value: 1,
                      },
                      {
                        label: 'Radio 2',
                        value: 2,
                      },
                    ]}
                    radioType='button'
                  />
                </>
              ),
            })
            dialog.loadData = async () => {
              await sleep(1000)
              dialog.props.placeholder = {
                number: 123,
              }
            }
            dialog.show(async (params) => {
              message.info(JSON.stringify(params))
            })
          }}
        >
          FlexibleFormDialog.async
        </Button>
      </Space>
    </>
  )
}
