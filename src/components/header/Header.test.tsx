import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Header } from './Header';

describe('Header', () => {
  test('renders the logo image with correct src and alt text', () => {
    render(<Header />);
    const logo = screen.getByAltText('SkyReady Logo');
    expect(logo).toBeInTheDocument();
    expect(logo).toHaveAttribute('src', '/logo.png');
  });

})