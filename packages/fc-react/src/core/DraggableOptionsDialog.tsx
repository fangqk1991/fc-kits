import React, { useState } from 'react'
import { Space, Tag } from 'antd'
import { MenuOutlined } from '@ant-design/icons'
import { SelectOption } from '@fangcha/tools'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps {
  options: SelectOption[]
}

export class DraggableOptionsDialog extends ReactDialog<Props, SelectOption[]> {
  title = '拖动调整顺序'

  static dialogWithOptions(options: SelectOption[]) {
    return new DraggableOptionsDialog({ options: options })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      const [options, setOptions] = useState([...props.options])

      props.context.handleResult = () => {
        return options
      }

      return (
        <DragDropContext
          onDragEnd={(result) => {
            if (!result.destination) {
              return
            }
            const newOptions = [...options]
            const [sourceItem] = newOptions.splice(result.source.index, 1)
            newOptions.splice(result.destination.index, 0, sourceItem)
            setOptions(newOptions)
          }}
        >
          <Droppable droppableId='droppable'>
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  padding: '8px',
                }}
              >
                {options.map((item, index) => (
                  <Draggable key={item.value} draggableId={`${item.value}`} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: 'block',
                          margin: `0 0 8px`,
                          ...provided.draggableProps.style,
                        }}
                      >
                        <Tag
                          color={snapshot.isDragging ? 'error' : 'success'}
                          style={{
                            padding: '4px 8px',
                            width: '100%',
                          }}
                        >
                          <Space>
                            <MenuOutlined />
                            {item.label}
                          </Space>
                        </Tag>
                      </div>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )
    }
  }
}
