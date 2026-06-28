// In-memory store for the Kanban board.
// Starts with three default columns so the board has something to show on first load.
import { v4 as uuidv4 } from 'uuid';

function freshColumns() {
  return [
    { id: uuidv4(), title: 'To Do',       order: 0, cards: [] },
    { id: uuidv4(), title: 'In Progress', order: 1, cards: [] },
    { id: uuidv4(), title: 'Done',        order: 2, cards: [] },
  ];
}

let columns = freshColumns();

// Returns all columns sorted by order, with their cards also sorted by order.
export function getColumns() {
  return columns
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((col) => ({
      ...col,
      cards: col.cards.slice().sort((a, b) => a.order - b.order),
    }));
}

// Finds a column by id. Returns undefined if not found.
export function findColumn(id) {
  return columns.find((c) => c.id === id);
}

// Creates a new column and adds it after all existing ones.
export function createColumn(title) {
  const maxOrder = columns.reduce((m, c) => Math.max(m, c.order), -1);
  const column = { id: uuidv4(), title, order: maxOrder + 1, cards: [] };
  columns.push(column);
  return column;
}

// Updates a column title. Returns the column, or undefined if not found.
export function updateColumn(id, title) {
  const column = findColumn(id);
  if (!column) return undefined;
  column.title = title;
  return column;
}

// Deletes a column along with all its cards. Returns true on success.
export function deleteColumn(id) {
  const before = columns.length;
  columns = columns.filter((c) => c.id !== id);
  return columns.length < before;
}

// Searches all columns for a card by id. Returns the card and its column together.
export function findCard(cardId) {
  for (const column of columns) {
    const card = column.cards.find((c) => c.id === cardId);
    if (card) return { card, column };
  }
  return undefined;
}

// Adds a new card to the given column. Returns undefined if the column does not exist.
export function createCard(columnId, title, description = '') {
  const column = findColumn(columnId);
  if (!column) return undefined;
  const maxOrder = column.cards.reduce((m, c) => Math.max(m, c.order), -1);
  const card = { id: uuidv4(), title, description, columnId, order: maxOrder + 1 };
  column.cards.push(card);
  return card;
}

// Updates a card's title and/or description. Returns the card, or undefined if not found.
export function updateCard(cardId, fields) {
  const result = findCard(cardId);
  if (!result) return undefined;
  const { card } = result;
  if (fields.title !== undefined) card.title = fields.title;
  if (fields.description !== undefined) card.description = fields.description;
  return card;
}

// Moves a card to a different column at the specified position.
export function moveCard(cardId, targetColumnId, order) {
  const result = findCard(cardId);
  if (!result) return undefined;
  const target = findColumn(targetColumnId);
  if (!target) return undefined;

  const { card, column: source } = result;

  // Pull the card out of its current column.
  source.cards = source.cards.filter((c) => c.id !== cardId);

  // Place it in the target column at the requested position.
  card.columnId = targetColumnId;
  card.order = order;
  target.cards.push(card);

  // Re-number the source column so there are no gaps in the order.
  source.cards
    .sort((a, b) => a.order - b.order)
    .forEach((c, i) => { c.order = i; });

  return card;
}

// Removes a card from whichever column it is in. Returns true on success.
export function deleteCard(cardId) {
  for (const column of columns) {
    const before = column.cards.length;
    column.cards = column.cards.filter((c) => c.id !== cardId);
    if (column.cards.length < before) return true;
  }
  return false;
}

// Updates each column's order to match the position of its id in the given array.
export function reorderColumns(ids) {
  ids.forEach((id, index) => {
    const col = findColumn(id);
    if (col) col.order = index;
  });
}

// Wipes the store and reseeds the default columns. Used in tests.
export function resetStore() {
  columns = freshColumns();
}
