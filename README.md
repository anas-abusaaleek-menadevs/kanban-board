# kanban-board

A simple Kanban board for managing tasks with drag-and-drop functionality. Users can create, edit, move, and delete cards across columns, with all changes persisted through a lightweight Node.js API.

## Features

- Drag-and-drop cards between columns using @hello-pangea/dnd
- Create, edit, and delete cards and columns
- Changes persisted through a REST API
- Clean, responsive layout

## Project structure

```
kanban-board/
  client/   React + Vite frontend
  server/   Express REST API
```

## Getting started

### Server

```bash
cd server
npm install
npm start
```

### Client

```bash
cd client
npm install
npm run dev
```

The client runs on http://localhost:5173 and proxies API requests to http://localhost:3001.

## License

MIT
