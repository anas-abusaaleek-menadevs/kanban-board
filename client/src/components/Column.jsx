// Renders a single column with its header, card list, and add-card form.
// The header doubles as the drag handle for column reordering.
import { useState } from 'react';
import { Droppable, Draggable } from '@hello-pangea/dnd';
import Card from './Card.jsx';
import AddCardForm from './AddCardForm.jsx';

export default function Column({ column, dragHandleProps, onAddCard, onUpdateCard, onDeleteCard, onUpdateColumn, onDeleteColumn }) {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState(column.title);

  function handleTitleSave(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdateColumn(column.id, trimmed);
    setEditingTitle(false);
  }

  return (
    <div className="column">
      <div className="column__header" {...dragHandleProps}>
        {editingTitle ? (
          <form onSubmit={handleTitleSave} className="column__title-form">
            <input
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <button type="submit">Save</button>
            <button type="button" onClick={() => { setTitle(column.title); setEditingTitle(false); }}>
              Cancel
            </button>
          </form>
        ) : (
          <>
            <h2 className="column__title">{column.title}</h2>
            <div className="column__header-actions">
              <button onClick={() => setEditingTitle(true)}>Rename</button>
              <button onClick={() => onDeleteColumn(column.id)}>Delete</button>
            </div>
          </>
        )}
      </div>

      {/* Each column is its own Droppable so cards can be dragged between columns. */}
      <Droppable droppableId={column.id} type="CARD">
        {(provided) => (
          <div
            className="column__cards"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {column.cards.map((card, index) => (
              <Draggable key={card.id} draggableId={card.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <Card
                      card={card}
                      onUpdate={onUpdateCard}
                      onDelete={onDeleteCard}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>

      <AddCardForm onAdd={(cardTitle) => onAddCard(column.id, cardTitle)} />
    </div>
  );
}
