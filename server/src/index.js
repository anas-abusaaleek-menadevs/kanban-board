// Express server entry point.
// Mounts the column and card routers and exposes a health check endpoint.
import express from 'express';
import cors from 'cors';
import columnRoutes from './routes/columns.js';
import cardRoutes from './routes/cards.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Simple health check used by the CI smoke test.
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/columns', columnRoutes);
app.use('/api', cardRoutes);

// Start listening only when the file is run directly, not when imported by tests.
if (process.argv[1] === new URL(import.meta.url).pathname) {
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
}

export default app;
