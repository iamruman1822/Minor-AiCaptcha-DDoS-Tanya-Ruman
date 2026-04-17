import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders landing hero headline', () => {
  render(
    <MemoryRouter initialEntries={['/']}>
      <App />
    </MemoryRouter>,
  );

  const heading = screen.getByText(/Stop bots\./i);
  expect(heading).toBeInTheDocument();
});
