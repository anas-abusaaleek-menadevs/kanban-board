import { useState } from 'react';

// Small inline form that sits at the bottom of each column.
export default function AddCardForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    setTitle('');
    setOpen(false);
  }

  if (!open) {
    return (
      <button className="add-card-btn" onClick={() => setOpen(true)}>
        + Add a card
      </button>
    );
  }

  return (
    <form className="add-card-form" onSubmit={handleSubmit}>
      <input
        autoFocus
        placeholder="Card title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="form-actions">
        <button type="submit">Add</button>
        <button type="button" onClick={() => { setTitle(''); setOpen(false); }}>
          Cancel
        </button>
      </div>
    </form>
  );
}
