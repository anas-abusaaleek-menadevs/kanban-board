// Toggled inline form at the bottom of each column.
// Shows a button by default and expands into an input when clicked.
import { useState } from 'react';

export default function AddCardForm({ onAdd }) {
  const [title, setTitle] = useState('');
  const [open, setOpen] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed);
    // Reset and collapse the form after a successful add.
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
