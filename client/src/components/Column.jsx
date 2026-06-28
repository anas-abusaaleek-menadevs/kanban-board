import { useState } from 'react';
import Card from './Card.jsx';
import AddCardForm from './AddCardForm.jsx';

export default function Column({ column, onAddCard, onUpdateCard, onDeleteCard, onUpdateColumn, onDeleteColumn }) {
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
      <div className="column__header">
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

      <div className="column__cards">
        {column.cards.map((card) => (
          <Card
            key={card.id}
            card={card}
            onUpdate={onUpdateCard}
            onDelete={onDeleteCard}
          />
        ))}
      </div>

      <AddCardForm onAdd={(cardTitle) => onAddCard(column.id, cardTitle)} />
    </div>
  );
}
