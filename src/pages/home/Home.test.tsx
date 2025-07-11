import { render, screen } from '@testing-library/react'
import { Home } from './Home'
import { describe, test, expect } from 'vitest'

describe('Home', () => {
  test('renders footer in home', () => {
    render(<Home />)
    expect(screen.getByTestId("home")).toBeInTheDocument();
  })
})