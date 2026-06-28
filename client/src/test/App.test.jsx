import { render, screen } from '@testing-library/react';
import App from '../App.jsx';

// Placeholder test — replaced with real tests in a later PR.
describe('App', () => {
  it('renders the app heading', () => {
    render(<App />);
    expect(screen.getByRole('heading', { name: /kanban board/i })).toBeInTheDocument();
  });
});
