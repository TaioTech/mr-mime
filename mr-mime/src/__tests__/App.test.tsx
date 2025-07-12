import '@testing-library/jest-dom';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../renderer/App';

describe('App', () => {
  it('should render', () => {
    expect(render(<App />)).toBeTruthy();
  });

  it('allows adding, editing and deleting items', () => {
    render(<App />);
    const input = screen.getByPlaceholderText('Add item');
    fireEvent.change(input, { target: { value: 'task' } });
    fireEvent.click(screen.getByLabelText('add-item'));
    expect(screen.getByText('task')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('edit-item'));
    const editInput = screen.getByLabelText('edit-input');
    fireEvent.change(editInput, { target: { value: 'updated' } });
    fireEvent.click(screen.getByLabelText('save-item'));
    expect(screen.getByText('updated')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText('delete-item'));
    expect(screen.queryByText('updated')).toBeNull();
  });
});
