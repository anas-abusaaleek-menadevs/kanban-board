// Tests for the Card component in both read mode and inline edit mode.
import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Card from '../components/Card.jsx';

// Shared card fixture used across all tests in this file.
const card = {
  id: 'card-1',
  title: 'Fix login bug',
  description: 'Happens on mobile',
  columnId: 'col-1',
  order: 0,
};

describe('Card', () => {
  it('renders the card title', () => {
    render(<Card card={card} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Fix login bug')).toBeInTheDocument();
  });

  it('renders the card description', () => {
    render(<Card card={card} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('Happens on mobile')).toBeInTheDocument();
  });

  // Clicking Edit replaces the read view with an input pre-filled with the card title.
  it('shows an edit form when Edit is clicked', () => {
    render(<Card card={card} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByDisplayValue('Fix login bug')).toBeInTheDocument();
  });

  // The Delete button must pass the card id to the handler so the caller knows which card to remove.
  it('calls onDelete with the card id when Delete is clicked', () => {
    const onDelete = vi.fn();
    render(<Card card={card} onUpdate={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('card-1');
  });

  // The description paragraph is conditional; an empty string must suppress it entirely.
  it('hides description when it is empty', () => {
    const cardNoDesc = { ...card, description: '' };
    render(<Card card={cardNoDesc} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('Happens on mobile')).not.toBeInTheDocument();
  });
});
