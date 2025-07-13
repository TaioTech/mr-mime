import { useState, useRef, useEffect, KeyboardEvent } from 'react';

interface Item {
  id: number;
  text: string;
}

type Action = 'none' | 'edit' | 'delete';

export default function TodoList() {
  const [items, setItems] = useState<Item[]>([]);
  const [input, setInput] = useState('');
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [selectedAction, setSelectedAction] = useState<Action>('none');

  /** ----------  drag helpers  ---------- */
  const dragFrom = useRef<number | null>(null);
  const dragOver = useRef<number | null>(null);
  const [dragOverIdx, setDragOverIdx] = useState<number | null>(null);

  /** ----------  add / edit / delete ---------- */
  const addItem = () => {
    const value = input.trim();
    if (!value) return;
    setItems([{ id: Date.now(), text: value }, ...items]); // prepend
    setInput('');
    setSelectedIndex(0);
  };

  const startEdit = (it: Item) => {
    setEditingId(it.id);
    setEditingText(it.text);
    setSelectedAction('edit');
  };

  const saveEdit = () => {
    if (editingId == null) return;
    setItems((prev) =>
      prev.map((it) =>
        it.id === editingId ? { ...it, text: editingText.trim() || it.text } : it,
      ),
    );
    setEditingId(null);
    setSelectedAction('none');
  };

  const removeItem = (id: number) => {
    setItems((prev) => prev.filter((it) => it.id !== id));
    setSelectedIndex(null);
    setSelectedAction('none');
  };

  /** ----------  keyboard nav ---------- */
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (selectedIndex != null) listRef.current?.focus();
  }, [selectedIndex]);

  const handleListKey = (e: KeyboardEvent<HTMLUListElement>) => {
    if (selectedIndex == null) return;
    const max = items.length - 1;

    switch (e.key) {
      case 'ArrowUp':
        setSelectedIndex((i) => (i! > 0 ? i! - 1 : max));
        setSelectedAction('none');
        break;
      case 'ArrowDown':
        setSelectedIndex((i) => (i! < max ? i! + 1 : 0));
        setSelectedAction('none');
        break;
      case 'ArrowLeft':
      case 'ArrowRight':
        if (selectedAction !== 'none') {
          setSelectedAction((a) => (a === 'edit' ? 'delete' : 'edit'));
        }
        break;
      case 'Enter':
        if (editingId != null) {
          saveEdit();
        } else if (selectedAction === 'none') {
          setSelectedAction('edit');
        } else if (selectedAction === 'edit') {
          startEdit(items[selectedIndex]);
        } else if (selectedAction === 'delete') {
          removeItem(items[selectedIndex].id);
        }
        break;
      case 'Delete':
        removeItem(items[selectedIndex].id);
        break;
      case 'Escape':
        setEditingId(null);
        setSelectedAction('none');
        break;
    }
  };

  /** ----------  drag-and-drop ---------- */
  const onDragStart = (idx: number) => () => {
    dragFrom.current = idx;
  };

  const onDragEnter = (idx: number) => () => {
    dragOver.current = idx;
    setDragOverIdx(idx);
  };

  const onDragEnd = () => {
    const from = dragFrom.current;
    const to = dragOver.current;
    if (from != null && to != null && from !== to) {
      setItems((prev) => {
        const clone = [...prev];
        const [moved] = clone.splice(from, 1);
        clone.splice(to, 0, moved);
        return clone;
      });
      setSelectedIndex(to);
    }
    dragFrom.current = dragOver.current = null;
    setDragOverIdx(null);
  };

  /** ----------  render ---------- */
  return (
    <main className="todo-container">
      <div className="todo-inputRow">
        <input
          className="todo-input"
          placeholder="Add a task…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && addItem()}
        />
        <button className="todo-addBtn" onClick={addItem}>
          Add
        </button>
      </div>

      <ul
        ref={listRef}
        tabIndex={0}
        className="todo-list"
        onKeyDown={handleListKey}
      >
        {items.map((item, index) => {
          const selected = selectedIndex === index;
          const action = selected ? selectedAction : 'none';
          const editing = editingId === item.id;
          const over = dragOverIdx === index;

          return (
            <li
              key={item.id}
              className={`todo-item${selected ? ' selected' : ''}${
                over ? ' drag-over' : ''
              }`}
              draggable
              onDragStart={onDragStart(index)}
              onDragEnter={onDragEnter(index)}
              onDragEnd={onDragEnd}
              onClick={() => {
                setSelectedIndex(index);
                setSelectedAction('none');
              }}
            >
              <span className="drag-handle" aria-hidden="true">
                ⋮⋮
              </span>

              {editing ? (
                <input
                  className="todo-editInput"
                  autoFocus
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveEdit();
                    if (e.key === 'Escape') setEditingId(null);
                  }}
                />
              ) : (
                <span className="todo-text">{item.text}</span>
              )}

              <div className="todo-actions">
                <button
                  className={`todo-editBtn ${
                    action === 'edit' ? 'action-selected' : ''
                  }`}
                  onClick={() => (editing ? saveEdit() : startEdit(item))}
                >
                  ✎
                </button>
                <button
                  className={`todo-removeBtn ${
                    action === 'delete' ? 'action-selected' : ''
                  }`}
                  onClick={() => removeItem(item.id)}
                >
                  ✕
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </main>
  );
}
