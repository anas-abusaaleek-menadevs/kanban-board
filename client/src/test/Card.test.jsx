import { render, screen, fireEvent } from '@testing-library/react';
import { vi } from 'vitest';
import Card from '../components/Card.jsx';

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

  it('shows an edit form when Edit is clicked', () => {
    render(<Card card={card} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    fireEvent.click(screen.getByRole('button', { name: /edit/i }));
    expect(screen.getByDisplayValue('Fix login bug')).toBeInTheDocument();
  });

  it('calls onDelete with the card id when Delete is clicked', () => {
    const onDelete = vi.fn();
    render(<Card card={card} onUpdate={vi.fn()} onDelete={onDelete} />);
    fireEvent.click(screen.getByRole('button', { name: /delete/i }));
    expect(onDelete).toHaveBeenCalledWith('card-1');
  });

  it('hides description when it is empty', () => {
    const cardNoDesc = { ...card, description: '' };
    render(<Card card={cardNoDesc} onUpdate={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.queryByText('Happens on mobile')).not.toBeInTheDocument();
  });
});
