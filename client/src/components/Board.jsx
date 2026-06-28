import { useEffect, useState } from 'react';
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

  // Reload all columns from the server after any mutation.
  async function refresh() {
    const data = await api.getColumns();
    setColumns(data);
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
    <div className="board">
      <div className="board__columns">
        {columns.map((col) => (
          <Column
            key={col.id}
            column={col}
            onAddCard={handleAddCard}
            onUpdateCard={handleUpdateCard}
            onDeleteCard={handleDeleteCard}
            onUpdateColumn={handleUpdateColumn}
            onDeleteColumn={handleDeleteColumn}
          />
        ))}

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
    </div>
  );
}
