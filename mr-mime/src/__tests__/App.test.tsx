import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../renderer/App';

describe('TodoList', () => {
  it('allows items to be added and removed', () => {
    render(<App />);

    const input = screen.getByPlaceholderText(/add todo/i);
    const addButton = screen.getByText(/add/i);

    fireEvent.change(input, { target: { value: 'First' } });
    fireEvent.click(addButton);
    expect(screen.getByText('First')).toBeInTheDocument();

    const removeButton = screen.getByText(/remove/i);
    fireEvent.click(removeButton);
    expect(screen.queryByText('First')).not.toBeInTheDocument();
  });
});
