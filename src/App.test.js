import { render, screen } from '@testing-library/react';
import App from './App';

test('renders the QRcode header brand', () => {
  render(<App />);
  expect(screen.getByText('QRcode')).toBeInTheDocument();
});
