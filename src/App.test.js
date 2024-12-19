import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Fortune Flux title', () => {
  render(<App />);
  const titleElement = screen.getByText(/Fortune Flux/i);
  expect(titleElement).toBeInTheDocument();
});

test('renders luck meter', () => {
  render(<App />);
  const meterElement = screen.getByText(/Your Luck Meter/i);
  expect(meterElement).toBeInTheDocument();
});
