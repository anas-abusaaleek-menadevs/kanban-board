import { useState } from 'react';

export default function Card({ card, onUpdate, onDelete }) {
  const [editing, setEditing] = useState(false);
  const [title, setTitle] = useState(card.title);
  const [description, setDescription] = useState(card.description || '');

  function handleSave(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onUpdate(card.id, { title: trimmed, description });
    setEditing(false);
  }

  if (editing) {
    return (
      <div className="card card--editing">
        <form onSubmit={handleSave}>
          <input
            autoFocus
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
          />
          <div className="form-actions">
            <button type="submit">Save</button>
            <button type="button" onClick={() => setEditing(false)}>Cancel</button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="card">
      <p className="card__title">{card.title}</p>
      {card.description && <p className="card__desc">{card.description}</p>}
      <div className="card__actions">
        <button onClick={() => setEditing(true)}>Edit</button>
        <button onClick={() => onDelete(card.id)}>Delete</button>
      </div>
    </div>
  );
}
