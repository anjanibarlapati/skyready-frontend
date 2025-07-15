import { render, screen } from '@testing-library/react'
import { describe, expect, test } from 'vitest'
import { App } from './App'
import { store } from './redux/store'
import { Provider } from 'react-redux'

describe('App', () => {
  test('renders home footer', () => {
    render(
      <Provider store={store}>
         <App />
      </Provider>
    )
    expect(screen.getByText(/© 2025 SkyReady. All rights reserved. ✈️/i)).toBeInTheDocument();
  })
})
