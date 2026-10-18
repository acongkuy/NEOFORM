import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors } from '@dnd-kit/core'
import { SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { QuestionEditor } from './QuestionEditor'

function SortableQuestion({ question, index, onChange, onDelete, onDuplicate }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: question.id })
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      <QuestionEditor question={question} index={index} onChange={onChange} onDelete={onDelete} onDuplicate={onDuplicate}
        dragHandle={{ ...listeners }} />
    </div>
  )
}

export function DragDropList({ questions, onChange, onDelete, onDuplicate, onReorder }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (active.id !== over.id) {
      const oldIndex = questions.findIndex(q => q.id === active.id)
      const newIndex = questions.findIndex(q => q.id === over.id)
      const updated = [...questions]
      const [moved] = updated.splice(oldIndex, 1)
      updated.splice(newIndex, 0, moved)
      onReorder(updated)
    }
  }

  return (
    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={questions.map(q => q.id)} strategy={verticalListSortingStrategy}>
        {questions.map((q, i) => (
          <SortableQuestion key={q.id} question={q} index={i} onChange={onChange} onDelete={onDelete} onDuplicate={onDuplicate} />
        ))}
      </SortableContext>
    </DndContext>
  )
}
