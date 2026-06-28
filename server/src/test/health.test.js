import request from 'supertest';
import app from '../index.js';

// Placeholder test — replaced with real API tests in a later PR.
describe('GET /api/health', () => {
  it('returns status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});
