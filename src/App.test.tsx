import { render, screen } from '@testing-library/react'
import App from './App'
import { describe, test, expect } from 'vitest'

describe('App', () => {
  test('renders welcome message', () => {
    render(<App />)
    expect(screen.getByText(/Welcome to SkyReady/i)).toBeInTheDocument();
  })
})
