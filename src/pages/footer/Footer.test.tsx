import { render, screen } from '@testing-library/react'
import { Footer } from './Footer'
import { describe, test, expect } from 'vitest'

describe('Footer', () => {
  test('renders footer text', () => {
    render(<Footer />)
    expect(screen.getByText(/© 2025 SkyReady. All rights reserved. ✈️/i)).toBeInTheDocument();
  })
})