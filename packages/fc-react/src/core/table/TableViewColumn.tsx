import React, { useEffect, useRef, useState } from 'react'
import { Button, Checkbox, Input, InputRef, Select, Space } from 'antd'
import { SelectOption } from '@fangcha/tools'
import { SearchOutlined } from '@ant-design/icons'

interface NormalProps<T = any> {
  title: React.ReactNode
  render?: (item: T, _: T, index: number) => React.ReactNode
}

interface SelectorProps<T = any> extends NormalProps<T> {
  options: SelectOption[]
  value?: any
  onValueChanged?: (newValues: any) => void | Promise<void>
}

interface MultipleSelectorProps<T = any> extends NormalProps<T> {
  options: SelectOption[]
  checkedValues?: any[]
  onCheckedValuesChanged?: (newValues: any[]) => void | Promise<void>
}

interface TextSearcherProps<T = any> extends NormalProps<T> {
  value?: any
  onValueChanged?: (newValues: any) => void | Promise<void>
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
  TextSearcher = 'TextSearcher',
}

export class TableViewColumn {
  public static makeColumns<T = any>(
    propsList: ((NormalProps<T> | SelectorProps<T> | MultipleSelectorProps<T> | TextSearcherProps<T>) & {
      filterType?: ColumnFilterType
    })[]
  ): ColumnAttrs<T>[] {
    return propsList.map((props) => {
      switch (props.filterType) {
        case ColumnFilterType.Selector:
          return TableViewColumn.selectorColumn(props as SelectorProps)
        case ColumnFilterType.MultiSelector:
          return TableViewColumn.multiSelectorColumn(props as MultipleSelectorProps)
        case ColumnFilterType.TextSearcher:
          return TableViewColumn.textSearcherColumn(props as TextSearcherProps)
      }
      return TableViewColumn.normalColumn(props as NormalProps)
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

  public static multiSelectorColumn<T = any>(props: MultipleSelectorProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.checkedValues && props.checkedValues.length > 0,
      filterDropdown: <TableViewColumn.MultiSelector {...props} />,
      render: props.render,
    }
  }

  public static MultiSelector: React.FC<MultipleSelectorProps> = ({
    title,
    options,
    checkedValues,
    onCheckedValuesChanged,
  }) => {
    return (
      <div style={{ padding: '8px' }}>
        {typeof title === 'string' && <h4 style={{ margin: '0 0 8px' }}>{title}</h4>}
        <Checkbox.Group
          options={options}
          value={checkedValues || []}
          onChange={(newValues) => {
            onCheckedValuesChanged && onCheckedValuesChanged(newValues)
          }}
        />
      </div>
    )
  }

  public static textSearcherColumn<T = any>(props: TextSearcherProps<T>): ColumnAttrs<T> {
    return {
      ...props,
      title: props.title,
      filtered: !!props.value,
      filterDropdown: <TableViewColumn.TextSearcher {...props} />,
      render: props.render,
    }
  }

  public static TextSearcher: React.FC<TextSearcherProps> = ({ title, value, onValueChanged }) => {
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
