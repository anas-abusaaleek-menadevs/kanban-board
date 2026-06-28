# Sample Session

This walkthrough shows how to run the board and use the main features.

---

## 1. Start the server and client

```bash
# Terminal 1
cd server && npm start
# Server listening on port 3001

# Terminal 2
cd client && npm run dev
# Local: http://localhost:5173/
```

Open http://localhost:5173 in your browser.

---

## 2. Default board

The board loads with three columns out of the box:

```
To Do          In Progress     Done
----------     -----------     ----
+ Add a card   + Add a card    + Add a card
```

---

## 3. Add a card

Click **+ Add a card** at the bottom of any column, type a title, and press **Add**.

```
To Do
----------
Fix login bug
+ Add a card
```

---

## 4. Edit a card

Click **Edit** on a card to update its title and add an optional description.

```
Fix login bug
[input: Fix login bug         ]
[textarea: Happens on mobile  ]
Save  Cancel
```

---

## 5. Drag cards between columns

Grab a card and drop it into a different column. The change is saved to the server immediately.

```
To Do          In Progress
----------     -----------
               Fix login bug   ← dragged here
+ Add a card   + Add a card
```

---

## 6. Reorder columns

Grab a column by its header and drag it left or right to reorder.

```
Before:  To Do | In Progress | Done
After:   In Progress | To Do | Done
```

---

## 7. Add a new column

Click **+ Add a column** on the right side of the board and type a title.

```
To Do   In Progress   Done   Review
                              + Add a card
```

---

## 8. API at a glance

All UI actions map directly to REST calls:

| Action            | Method | Endpoint                          |
|-------------------|--------|-----------------------------------|
| Load board        | GET    | /api/columns                      |
| Add column        | POST   | /api/columns                      |
| Rename column     | PUT    | /api/columns/:id                  |
| Reorder columns   | PATCH  | /api/columns/reorder              |
| Delete column     | DELETE | /api/columns/:id                  |
| Add card          | POST   | /api/columns/:columnId/cards      |
| Edit card         | PUT    | /api/cards/:id                    |
| Move card         | PATCH  | /api/cards/:id/move               |
| Delete card       | DELETE | /api/cards/:id                    |
