// Tests for the Board component covering loading state, error handling, and data rendering.
// The API module and the dnd library are both mocked so tests run in jsdom without side effects.
import { render, screen, waitFor } from '@testing-library/react';
import { vi } from 'vitest';
import Board from '../components/Board.jsx';

// Mock the API module so tests never hit the network.
vi.mock('../api/kanban.js', () => ({
  getColumns: vi.fn(),
  createColumn: vi.fn(),
  updateColumn: vi.fn(),
  reorderColumns: vi.fn(),
  deleteColumn: vi.fn(),
  createCard: vi.fn(),
  updateCard: vi.fn(),
  moveCard: vi.fn(),
  deleteCard: vi.fn(),
}));

// Mock @hello-pangea/dnd so drag-and-drop primitives render as plain divs in jsdom.
vi.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({ children }) => children,
  Droppable: ({ children }) => children({ innerRef: () => {}, droppableProps: {}, placeholder: null }, {}),
  Draggable: ({ children }) => children({ innerRef: () => {}, draggableProps: {}, dragHandleProps: {} }, {}),
}));

import * as api from '../api/kanban.js';

// Sample columns used to seed the mocked API. col-2 includes one card.
const sampleColumns = [
  { id: 'col-1', title: 'To Do', order: 0, cards: [] },
  { id: 'col-2', title: 'In Progress', order: 1, cards: [
    { id: 'card-1', title: 'Fix bug', description: '', columnId: 'col-2', order: 0 },
  ]},
];

// Clear all mock call history before each test to prevent cross-test contamination.
beforeEach(() => {
  vi.clearAllMocks();
});

describe('Board', () => {
  // A never-resolving promise keeps the component in the loading state for this test.
  it('shows a loading message before data arrives', () => {
    api.getColumns.mockReturnValue(new Promise(() => {}));
    render(<Board />);
    expect(screen.getByText(/loading board/i)).toBeInTheDocument();
  });

  it('renders column titles after the API responds', async () => {
    api.getColumns.mockResolvedValue(sampleColumns);
    render(<Board />);
    await waitFor(() => {
      expect(screen.getByText('To Do')).toBeInTheDocument();
      expect(screen.getByText('In Progress')).toBeInTheDocument();
    });
  });

  // Cards are nested inside columns; both must appear after the promise resolves.
  it('renders cards inside their column', async () => {
    api.getColumns.mockResolvedValue(sampleColumns);
    render(<Board />);
    await waitFor(() => {
      expect(screen.getByText('Fix bug')).toBeInTheDocument();
    });
  });

  // A rejected promise triggers the error branch and shows the fallback message.
  it('shows an error message when the API fails', async () => {
    api.getColumns.mockRejectedValue(new Error('network error'));
    render(<Board />);
    await waitFor(() => {
      expect(screen.getByText(/could not load the board/i)).toBeInTheDocument();
    });
  });
});
