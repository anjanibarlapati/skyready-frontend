import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from './App'

describe('App', () => {
  test('renders home footer', () => {
    render(<App />)
    expect(screen.getByText(/© 2025 SkyReady. All rights reserved. ✈️/i)).toBeInTheDocument();
  })
})
