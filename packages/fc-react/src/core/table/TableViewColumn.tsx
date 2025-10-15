import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Input, InputRef, Select, Space } from 'antd'
import { SelectOption } from '@fangcha/tools'
import { SearchOutlined } from '@ant-design/icons'

interface NormalProps<T = any> {
  key?: string
  filterType?: ColumnFilterType
  title: React.ReactNode
  render?: (item: T, _: T, index: number) => React.ReactNode
}

interface SingleValueProps<T = any> extends NormalProps<T> {
  value?: any
  onValueChanged?: (newValues: any) => void | Promise<void>
}

interface SelectorProps<T = any> extends SingleValueProps<T> {
  options: SelectOption[]
}

interface MultiSelectorProps<T = any> extends NormalProps<T> {
  options: SelectOption[]
  checkedValues?: any[]
  onCheckedValuesChanged?: (newValues: any[]) => void | Promise<void>
}

interface ColumnAttrs<T = any> {
  title: React.ReactNode
  filtered?: boolean
  filterDropdown?: React.ReactNode
  render?: (item: T, _: T, index: number) => React.ReactNode
}

export enum ColumnFilterType {
  None = 'None',
  Selector = 'Selector',
  MultiSelector = 'MultiSelector',
  StrMultiSelector = 'StrMultiSelector',
  TextSearcher = 'TextSearcher',
}

export class TableViewColumn {
  public static makeColumns<T = any>(
    propsList: (NormalProps<T> | SelectorProps<T> | MultiSelectorProps<T> | SingleValueProps<T>)[],
    pageOptions: { sortKey?: string; sortDirection?: string } = {}
  ): ColumnAttrs<T>[] {
    return propsList.map((props) => {
      let attrs: ColumnAttrs<T> = TableViewColumn.normalColumn(props as NormalProps)
      switch (props.filterType) {
        case ColumnFilterType.Selector:
          attrs = TableViewColumn.selectorColumn(props as SelectorProps)
          break
        case ColumnFilterType.MultiSelector:
          attrs = TableViewColumn.multiSelectorColumn(props as MultiSelectorProps)
          break
        case ColumnFilterType.StrMultiSelector:
          attrs = TableViewColumn.strMultiSelectorColumn(props as MultiSelectorProps)
          break
        case ColumnFilterType.TextSearcher:
          attrs = TableViewColumn.textSearcherColumn(props as SingleValueProps)
          break
      }
      if (props.key && pageOptions.sortKey === props.key && pageOptions.sortDirection) {
        attrs['sortOrder'] = pageOptions['sortDirection']
      }
      return attrs
    })
  }

  public static normalColumn<T = any>(props: NormalProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      render: props.render,
    }
  }

  public static selectorColumn<T = any>(props: SelectorProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.value,
      filterDropdown: <TableViewColumn.Selector {...props} />,
      render: props.render,
    }
  }

  public static Selector: React.FC<SelectorProps> = ({ title, options, value, onValueChanged }) => {
    return (
      <div style={{ padding: '8px' }}>
        {typeof title === 'string' && <h4 style={{ margin: '0 0 8px' }}>{title}</h4>}
        <Select
          value={value || ''}
          style={{ minWidth: '200px' }}
          onChange={(value) => {
            onValueChanged && onValueChanged(value)
          }}
          size={'small'}
          options={[
            {
              label: 'ALL',
              value: '',
            },
            ...options,
          ]}
        />
      </div>
    )
  }

  public static multiSelectorColumn<T = any>(props: MultiSelectorProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.checkedValues && props.checkedValues.length > 0,
      filterDropdown: <TableViewColumn.MultiSelector {...props} />,
      render: props.render,
    }
  }

  public static MultiSelector: React.FC<MultiSelectorProps> = ({
    title,
    options,
    checkedValues,
    onCheckedValuesChanged,
  }) => {
    if (checkedValues && !Array.isArray(checkedValues)) {
      checkedValues = [checkedValues]
    }
    return (
      <div style={{ padding: '8px' }}>
        {typeof title === 'string' && <h4 style={{ margin: '0 0 8px' }}>{title}</h4>}
        <Checkbox.Group
          style={{
            display: 'inline-block',
          }}
          options={options}
          value={checkedValues || []}
          onChange={(newValues) => {
            onCheckedValuesChanged && onCheckedValuesChanged(newValues)
          }}
        />
      </div>
    )
  }

  public static strMultiSelectorColumn<T = any>(props: SelectorProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.value,
      filterDropdown: <TableViewColumn.StrMultiSelector {...props} />,
      render: props.render,
    }
  }

  public static StrMultiSelector: React.FC<SelectorProps> = ({ title, options, value, onValueChanged }) => {
    const checkedValues = `${value || ''}`
      .split(',')
      .map((item) => item.trim())
      .filter((item) => !!item)
    return (
      <TableViewColumn.MultiSelector
        title={title}
        options={options}
        checkedValues={checkedValues}
        onCheckedValuesChanged={(newValues) => {
          onValueChanged && onValueChanged(newValues.join(','))
        }}
      />
    )
  }

  public static textSearcherColumn<T = any>(props: SingleValueProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.value,
      filterDropdown: <TableViewColumn.TextSearcher {...props} />,
      render: props.render,
    }
  }

  public static TextSearcher: React.FC<SingleValueProps> = ({ title, value, onValueChanged }) => {
    const searchInput = useRef<InputRef>(null)
    const [text, setText] = useState(value)
    const onConfirm = () => {
      onValueChanged && onValueChanged(text)
    }
    useEffect(() => {
      setText(value)
    }, [value])

    return (
      <div style={{ padding: '8px' }}>
        {typeof title === 'string' && <h4 style={{ margin: '0 0 8px' }}>{title}</h4>}
        <Input
          ref={searchInput}
          placeholder={`Keywords`}
          value={text || ''}
          onChange={(e) => setText(e.target.value)}
          onPressEnter={onConfirm}
          style={{
            marginBottom: 8,
            display: 'block',
          }}
        />
        <Space>
          <Button type='primary' onClick={onConfirm} icon={<SearchOutlined />} size='small' style={{ width: 110 }}>
            Search
          </Button>
          <Button
            onClick={() => {
              setText('')
              onValueChanged && onValueChanged('')
            }}
            size='small'
            style={{ width: 110 }}
          >
            Reset
          </Button>
        </Space>
      </div>
    )
  }
}
