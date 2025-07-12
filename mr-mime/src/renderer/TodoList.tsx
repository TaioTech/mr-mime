import { useState, KeyboardEvent } from 'react';

interface Item {
  id: number;
  text: string;
}

export default function TodoList() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const addItem = () => {
    if (input.trim() === '') return;
    setItems([...items, { id: Date.now(), text: input.trim() }]);
    setInput('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      addItem();
    }
  };

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const startEdit = (item: Item) => {
    setEditingId(item.id);
    setEditingText(item.text);
  };

  const saveEdit = (id: number) => {
    if (editingText.trim() === '') return;
    setItems(items.map((item) => (item.id === id ? { ...item, text: editingText } : item)));
    setEditingId(null);
    setEditingText('');
  };

  return (
    <div className="todo-container">
      <h1>Todo List</h1>
      <div className="todo-add">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Add item"
        />
        <button type="button" onClick={addItem} aria-label="add-item">
          Add
        </button>
      </div>
      <ul className="todo-items">
        {items.map((item) => (
          <li key={item.id} className="todo-item">
            {editingId === item.id ? (
              <>
                <input
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit(item.id);
                  }}
                  aria-label="edit-input"
                />
                <button type="button" onClick={() => saveEdit(item.id)} aria-label="save-item">
                  Save
                </button>
              </>
            ) : (
              <>
                <span>{item.text}</span>
                <button type="button" onClick={() => startEdit(item)} aria-label="edit-item">
                  Edit
                </button>
                <button type="button" onClick={() => removeItem(item.id)} aria-label="delete-item">
                  Delete
                </button>
              </>
              )
            </li>
          ))}
      </ul>
    </div>
  );
}
