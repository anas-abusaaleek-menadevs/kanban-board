import { useEffect, useState } from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import Column from './Column.jsx';
import * as api from '../api/kanban.js';

export default function Board() {
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newColTitle, setNewColTitle] = useState('');
  const [addingCol, setAddingCol] = useState(false);

  useEffect(() => {
    api.getColumns()
      .then(setColumns)
      .catch(() => setError('Could not load the board. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  async function refresh() {
    const data = await api.getColumns();
    setColumns(data);
  }

  async function handleDragEnd(result) {
    const { source, destination, type, draggableId } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    if (type === 'CARD') {
      // Update local state immediately so there is no visible flicker, then persist.
      const next = columns.map((col) => ({ ...col, cards: [...col.cards] }));
      const src = next.find((c) => c.id === source.droppableId);
      const dest = next.find((c) => c.id === destination.droppableId);
      const [movedCard] = src.cards.splice(source.index, 1);
      movedCard.columnId = destination.droppableId;
      dest.cards.splice(destination.index, 0, movedCard);
      setColumns(next);
      await api.moveCard(draggableId, destination.droppableId, destination.index);
    }

    if (type === 'COLUMN') {
      // Update state immediately so the drag feels instant, then persist the new order.
      const reordered = Array.from(columns);
      const [moved] = reordered.splice(source.index, 1);
      reordered.splice(destination.index, 0, moved);
      setColumns(reordered);
      await api.reorderColumns(reordered.map((c) => c.id));
    }
  }

  async function handleAddColumn(e) {
    e.preventDefault();
    const trimmed = newColTitle.trim();
    if (!trimmed) return;
    await api.createColumn(trimmed);
    setNewColTitle('');
    setAddingCol(false);
    refresh();
  }

  async function handleUpdateColumn(id, title) {
    await api.updateColumn(id, title);
    refresh();
  }

  async function handleDeleteColumn(id) {
    await api.deleteColumn(id);
    refresh();
  }

  async function handleAddCard(columnId, title) {
    await api.createCard(columnId, title);
    refresh();
  }

  async function handleUpdateCard(id, fields) {
    await api.updateCard(id, fields);
    refresh();
  }

  async function handleDeleteCard(id) {
    await api.deleteCard(id);
    refresh();
  }

  if (loading) return <p className="board-message">Loading board...</p>;
  if (error) return <p className="board-message board-message--error">{error}</p>;

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="board" direction="horizontal" type="COLUMN">
        {(provided) => (
          <div
            className="board__columns"
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {columns.map((col, index) => (
              <Draggable key={col.id} draggableId={col.id} index={index}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <Column
                      column={col}
                      dragHandleProps={provided.dragHandleProps}
                      onAddCard={handleAddCard}
                      onUpdateCard={handleUpdateCard}
                      onDeleteCard={handleDeleteCard}
                      onUpdateColumn={handleUpdateColumn}
                      onDeleteColumn={handleDeleteColumn}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}

            <div className="board__add-column">
              {addingCol ? (
                <form onSubmit={handleAddColumn}>
                  <input
                    autoFocus
                    placeholder="Column title"
                    value={newColTitle}
                    onChange={(e) => setNewColTitle(e.target.value)}
                  />
                  <div className="form-actions">
                    <button type="submit">Add</button>
                    <button type="button" onClick={() => { setNewColTitle(''); setAddingCol(false); }}>
                      Cancel
                    </button>
                  </div>
                </form>
              ) : (
                <button className="add-column-btn" onClick={() => setAddingCol(true)}>
                  + Add a column
                </button>
              )}
            </div>
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
