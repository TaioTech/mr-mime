import { useState } from 'react';

export default function TodoList() {
  const [items, setItems] = useState<string[]>([]);
  const [text, setText] = useState('');

  const addItem = () => {
    const value = text.trim();
    if (value) {
      setItems([...items, value]);
      setText('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div>
      <input
        placeholder="Add todo"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />
      <button type="button" onClick={addItem}>
        Add
      </button>
      <ul>
        {items.map((item, index) => (
          <li key={item}>
            {item}
            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
