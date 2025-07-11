import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { AboutUs } from './AboutUs'

describe('AboutUs component', () => {

  it('displays the heading', () => {
    render(<AboutUs />)
    const heading = screen.getByRole('heading', { name: /about us/i })
    expect(heading).toBeInTheDocument()
  })

  it('displays the description paragraph', () => {
    render(<AboutUs />)
    const paragraph = screen.getByText(/skyready is a simple and reliable flight booking platform/i)
    expect(paragraph).toBeInTheDocument()
  })
})
