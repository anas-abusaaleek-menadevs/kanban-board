import { render, screen, fireEvent, within } from '@testing-library/react';
import { vi } from 'vitest';
import Column from '../components/Column.jsx';

vi.mock('@hello-pangea/dnd', () => ({
  Droppable: ({ children }) => children({ innerRef: () => {}, droppableProps: {}, placeholder: null }, {}),
  Draggable: ({ children }) => children({ innerRef: () => {}, draggableProps: {}, dragHandleProps: {} }, {}),
}));

const column = {
  id: 'col-1',
  title: 'To Do',
  order: 0,
  cards: [
    { id: 'card-1', title: 'Write tests', description: 'Important', columnId: 'col-1', order: 0 },
  ],
};

const noop = vi.fn();

function renderColumn(overrides = {}) {
  return render(
    <Column
      column={column}
      dragHandleProps={{}}
      onAddCard={noop}
      onUpdateCard={noop}
      onDeleteCard={noop}
      onUpdateColumn={noop}
      onDeleteColumn={noop}
      {...overrides}
    />
  );
}

describe('Column', () => {
  it('renders the column title', () => {
    renderColumn();
    expect(screen.getByText('To Do')).toBeInTheDocument();
  });

  it('renders cards inside the column', () => {
    renderColumn();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('shows a rename form when Rename is clicked', () => {
    renderColumn();
    fireEvent.click(screen.getByRole('button', { name: /rename/i }));
    expect(screen.getByDisplayValue('To Do')).toBeInTheDocument();
  });

  it('calls onDeleteColumn when Delete is clicked', () => {
    const onDeleteColumn = vi.fn();
    renderColumn({ onDeleteColumn });
    // Scope to the column header to avoid matching the card's Delete button.
    const header = screen.getByRole('heading', { name: /to do/i }).closest('.column__header');
    fireEvent.click(within(header).getByRole('button', { name: /delete/i }));
    expect(onDeleteColumn).toHaveBeenCalledWith('col-1');
  });

  it('shows the add card button', () => {
    renderColumn();
    expect(screen.getByRole('button', { name: /add a card/i })).toBeInTheDocument();
  });
});
