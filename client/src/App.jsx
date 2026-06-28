// Top-level shell that renders the header and the board.
import Board from './components/Board.jsx';

export default function App() {
  return (
    <div className="app">
      <header className="app-header">
        <h1>Kanban Board</h1>
      </header>
      <main>
        <Board />
      </main>
    </div>
  );
}
