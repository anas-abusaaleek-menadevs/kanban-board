// All API calls to the Express server.
import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Columns
export const getColumns = () => api.get('/columns').then((r) => r.data);
export const createColumn = (title) => api.post('/columns', { title }).then((r) => r.data);
export const updateColumn = (id, title) => api.put(`/columns/${id}`, { title }).then((r) => r.data);
export const reorderColumns = (ids) => api.patch('/columns/reorder', { ids }).then((r) => r.data);
export const deleteColumn = (id) => api.delete(`/columns/${id}`);

// Cards
export const createCard = (columnId, title, description = '') =>
  api.post(`/columns/${columnId}/cards`, { title, description }).then((r) => r.data);
export const updateCard = (id, fields) => api.put(`/cards/${id}`, fields).then((r) => r.data);
export const moveCard = (id, columnId, order) =>
  api.patch(`/cards/${id}/move`, { columnId, order }).then((r) => r.data);
export const deleteCard = (id) => api.delete(`/cards/${id}`);
