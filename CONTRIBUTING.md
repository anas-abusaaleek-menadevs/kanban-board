# Contributing

## Setup

```bash
cd server && npm install
cd ../client && npm install
```

## Workflow

- One issue per feature or bug fix
- One branch per issue: `feat/<slug>`, `fix/<slug>`, `docs/<slug>`
- Conventional Commits: `feat:`, `fix:`, `docs:`, `chore:`

## Checks

```bash
cd client && npm run lint && npm test
cd ../server && npm test
```

Both must pass before opening a pull request.
