import request from 'supertest';
import app from '../index.js';
import { resetStore } from '../data/store.js';

beforeEach(() => resetStore());

/** Helper: get the first column id from a fresh store. */
async function firstColumnId() {
  const res = await request(app).get('/api/columns');
  return res.body[0].id;
}

/** Helper: create a card in the first column and return the response body. */
async function createCard(title = 'Test card', description = '') {
  const colId = await firstColumnId();
  const res = await request(app)
    .post(`/api/columns/${colId}/cards`)
    .send({ title, description });
  return res.body;
}

describe('POST /api/columns/:columnId/cards', () => {
  it('creates a card and returns 201', async () => {
    const colId = await firstColumnId();
    const res = await request(app)
      .post(`/api/columns/${colId}/cards`)
      .send({ title: 'Fix bug' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Fix bug');
    expect(res.body).toHaveProperty('id');
    expect(res.body.columnId).toBe(colId);
  });

  it('returns 400 when title is missing', async () => {
    const colId = await firstColumnId();
    const res = await request(app)
      .post(`/api/columns/${colId}/cards`)
      .send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for unknown column', async () => {
    const res = await request(app)
      .post('/api/columns/nonexistent/cards')
      .send({ title: 'X' });
    expect(res.statusCode).toBe(404);
  });

  it('card appears inside the column after creation', async () => {
    const colId = await firstColumnId();
    await request(app)
      .post(`/api/columns/${colId}/cards`)
      .send({ title: 'Fix bug' });
    const columns = (await request(app).get('/api/columns')).body;
    const col = columns.find((c) => c.id === colId);
    expect(col.cards.some((c) => c.title === 'Fix bug')).toBe(true);
  });
});

describe('PUT /api/cards/:id', () => {
  it('updates card title', async () => {
    const card = await createCard('Original');
    const res = await request(app)
      .put(`/api/cards/${card.id}`)
      .send({ title: 'Updated' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Updated');
  });

  it('updates card description', async () => {
    const card = await createCard('Card');
    const res = await request(app)
      .put(`/api/cards/${card.id}`)
      .send({ description: 'New desc' });
    expect(res.statusCode).toBe(200);
    expect(res.body.description).toBe('New desc');
  });

  it('returns 404 for unknown card id', async () => {
    const res = await request(app)
      .put('/api/cards/nonexistent')
      .send({ title: 'X' });
    expect(res.statusCode).toBe(404);
  });
});

describe('PATCH /api/cards/:id/move', () => {
  it('moves a card to another column', async () => {
    const card = await createCard('Move me');
    const columns = (await request(app).get('/api/columns')).body;
    const targetId = columns[1].id;

    const res = await request(app)
      .patch(`/api/cards/${card.id}/move`)
      .send({ columnId: targetId, order: 0 });
    expect(res.statusCode).toBe(200);
    expect(res.body.columnId).toBe(targetId);
  });

  it('returns 400 when columnId is missing', async () => {
    const card = await createCard('Card');
    const res = await request(app)
      .patch(`/api/cards/${card.id}/move`)
      .send({ order: 0 });
    expect(res.statusCode).toBe(400);
  });

  it('returns 404 for unknown card id', async () => {
    const columns = (await request(app).get('/api/columns')).body;
    const res = await request(app)
      .patch('/api/cards/nonexistent/move')
      .send({ columnId: columns[0].id, order: 0 });
    expect(res.statusCode).toBe(404);
  });
});

describe('DELETE /api/cards/:id', () => {
  it('deletes a card and returns 204', async () => {
    const card = await createCard('Delete me');
    const res = await request(app).delete(`/api/cards/${card.id}`);
    expect(res.statusCode).toBe(204);
  });

  it('deleted card no longer appears in the column', async () => {
    const colId = await firstColumnId();
    const card = await createCard('Delete me');
    await request(app).delete(`/api/cards/${card.id}`);
    const columns = (await request(app).get('/api/columns')).body;
    const col = columns.find((c) => c.id === colId);
    expect(col.cards.find((c) => c.id === card.id)).toBeUndefined();
  });

  it('returns 404 for unknown card id', async () => {
    const res = await request(app).delete('/api/cards/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
