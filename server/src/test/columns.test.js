import request from 'supertest';
import app from '../index.js';
import { resetStore } from '../data/store.js';

beforeEach(() => resetStore());

describe('GET /api/columns', () => {
  it('returns an array of columns', async () => {
    const res = await request(app).get('/api/columns');
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('returns three default columns', async () => {
    const res = await request(app).get('/api/columns');
    expect(res.body).toHaveLength(3);
  });

  it('each column has id, title, order, and cards fields', async () => {
    const res = await request(app).get('/api/columns');
    for (const col of res.body) {
      expect(col).toHaveProperty('id');
      expect(col).toHaveProperty('title');
      expect(col).toHaveProperty('order');
      expect(col).toHaveProperty('cards');
    }
  });

  it('columns are sorted by order ascending', async () => {
    const res = await request(app).get('/api/columns');
    const orders = res.body.map((c) => c.order);
    expect(orders).toEqual([...orders].sort((a, b) => a - b));
  });
});

describe('POST /api/columns', () => {
  it('creates a new column and returns 201', async () => {
    const res = await request(app)
      .post('/api/columns')
      .send({ title: 'Review' });
    expect(res.statusCode).toBe(201);
    expect(res.body.title).toBe('Review');
    expect(res.body).toHaveProperty('id');
  });

  it('returns 400 when title is missing', async () => {
    const res = await request(app).post('/api/columns').send({});
    expect(res.statusCode).toBe(400);
  });

  it('returns 400 when title is empty string', async () => {
    const res = await request(app).post('/api/columns').send({ title: '  ' });
    expect(res.statusCode).toBe(400);
  });

  it('new column appears in GET /api/columns', async () => {
    await request(app).post('/api/columns').send({ title: 'Review' });
    const res = await request(app).get('/api/columns');
    const titles = res.body.map((c) => c.title);
    expect(titles).toContain('Review');
  });
});

describe('PUT /api/columns/:id', () => {
  it('updates the column title', async () => {
    const columns = (await request(app).get('/api/columns')).body;
    const id = columns[0].id;
    const res = await request(app)
      .put(`/api/columns/${id}`)
      .send({ title: 'Backlog' });
    expect(res.statusCode).toBe(200);
    expect(res.body.title).toBe('Backlog');
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app)
      .put('/api/columns/nonexistent')
      .send({ title: 'X' });
    expect(res.statusCode).toBe(404);
  });

  it('returns 400 when title is missing', async () => {
    const columns = (await request(app).get('/api/columns')).body;
    const id = columns[0].id;
    const res = await request(app).put(`/api/columns/${id}`).send({});
    expect(res.statusCode).toBe(400);
  });
});

describe('DELETE /api/columns/:id', () => {
  it('deletes a column and returns 204', async () => {
    const columns = (await request(app).get('/api/columns')).body;
    const id = columns[0].id;
    const res = await request(app).delete(`/api/columns/${id}`);
    expect(res.statusCode).toBe(204);
  });

  it('deleted column no longer appears in GET /api/columns', async () => {
    const columns = (await request(app).get('/api/columns')).body;
    const id = columns[0].id;
    await request(app).delete(`/api/columns/${id}`);
    const res = await request(app).get('/api/columns');
    expect(res.body.find((c) => c.id === id)).toBeUndefined();
  });

  it('returns 404 for unknown id', async () => {
    const res = await request(app).delete('/api/columns/nonexistent');
    expect(res.statusCode).toBe(404);
  });
});
