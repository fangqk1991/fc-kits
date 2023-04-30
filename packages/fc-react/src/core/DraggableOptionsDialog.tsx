import React from 'react'
import { Tag } from 'antd'
import { SelectOption } from '@fangcha/tools'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { DialogProps, ReactDialog } from './ReactDialog'

interface Props extends DialogProps {
  options: SelectOption[]
}

export class DraggableOptionsDialog extends ReactDialog<Props, (string | number | boolean)[]> {
  title = '拖动调整顺序'

  static dialogWithOptions(options: SelectOption[]) {
    return new DraggableOptionsDialog({ options: options })
  }

  public rawComponent(): React.FC<Props> {
    return (props) => {
      props.context.handleResult = () => {
        return []
      }

      return (
        <DragDropContext onDragEnd={() => {}}>
          <Droppable droppableId='droppable'>
            {(provided: any) => (
              <div
                {...provided.droppableProps}
                ref={provided.innerRef}
                style={{
                  padding: '8px',
                }}
              >
                {props.options.map((item, index) => (
                  <Draggable key={item.value} draggableId={`${item.value}`} index={index}>
                    {(provided: any, snapshot: any) => (
                      <Tag
                        color={snapshot.isDragging ? 'error' : 'success'}
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={{
                          display: 'block',
                          margin: `4px 0`,
                          padding: '4px 8px',
                          ...provided.draggableProps.style,
                        }}
                      >
                        {item.label}
                      </Tag>
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
