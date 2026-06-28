// Card routes: create, update, move, and delete cards.
import { Router } from 'express';
import {
  createCard,
  updateCard,
  moveCard,
  deleteCard,
  findColumn,
} from '../data/store.js';

const router = Router();

// POST /api/columns/:columnId/cards
router.post('/columns/:columnId/cards', (req, res) => {
  const { title, description } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  if (!findColumn(req.params.columnId)) {
    return res.status(404).json({ error: 'column not found' });
  }
  const card = createCard(req.params.columnId, title.trim(), description ?? '');
  res.status(201).json(card);
});

// PUT /api/cards/:id
router.put('/cards/:id', (req, res) => {
  const { title, description } = req.body;
  if (title !== undefined && (typeof title !== 'string' || !title.trim())) {
    return res.status(400).json({ error: 'title must be a non-empty string' });
  }
  // Both fields are optional. Omitting one leaves the existing value unchanged.
  const card = updateCard(req.params.id, {
    title: title?.trim(),
    description,
  });
  if (!card) return res.status(404).json({ error: 'card not found' });
  res.json(card);
});

// PATCH /api/cards/:id/move
router.patch('/cards/:id/move', (req, res) => {
  const { columnId, order } = req.body;
  if (!columnId || typeof order !== 'number') {
    return res.status(400).json({ error: 'columnId and numeric order are required' });
  }
  const card = moveCard(req.params.id, columnId, order);
  if (!card) return res.status(404).json({ error: 'card or target column not found' });
  res.json(card);
});

// DELETE /api/cards/:id
router.delete('/cards/:id', (req, res) => {
  const removed = deleteCard(req.params.id);
  if (!removed) return res.status(404).json({ error: 'card not found' });
  res.status(204).send();
});

export default router;
