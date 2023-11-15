import React from 'react'
import { Space, Tag } from 'antd'
import { SelectOption } from '@fangcha/tools'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { MenuOutlined } from '@ant-design/icons'

interface Props {
  options: SelectOption[]
  onChange?: (newOptions: SelectOption[]) => void | Promise<void>
}

export const DraggableOptionsPanel: React.FC<Props> = (props) => {
  const options = props.options

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (!result.destination) {
          return
        }
        if (result.source.index === result.destination.index) {
          return
        }
        const newOptions = [...options]
        const [sourceItem] = newOptions.splice(result.source.index, 1)
        newOptions.splice(result.destination.index, 0, sourceItem)

        if (props.onChange) {
          props.onChange(newOptions)
        }
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
