// Column routes: GET, POST, PUT, DELETE /api/columns
import { Router } from 'express';
import {
  getColumns,
  createColumn,
  updateColumn,
  deleteColumn,
} from '../data/store.js';

const router = Router();

router.get('/', (_req, res) => {
  res.json(getColumns());
});

router.post('/', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const column = createColumn(title.trim());
  res.status(201).json(column);
});

router.put('/:id', (req, res) => {
  const { title } = req.body;
  if (!title || typeof title !== 'string' || !title.trim()) {
    return res.status(400).json({ error: 'title is required' });
  }
  const column = updateColumn(req.params.id, title.trim());
  if (!column) return res.status(404).json({ error: 'column not found' });
  res.json(column);
});

router.delete('/:id', (req, res) => {
  const removed = deleteColumn(req.params.id);
  if (!removed) return res.status(404).json({ error: 'column not found' });
  res.status(204).send();
});

export default router;
