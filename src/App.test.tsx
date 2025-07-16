import { render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from './redux/store';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import { App } from './App';
import { ConfirmBooking } from './pages/confirmBooking/ConfirmBooking';

const mockFlight = {
  flight_number: 'AI202',
  airline_name: 'Air India',
  source: 'Delhi',
  destination: 'Mumbai',
  departure_date: '2025-07-18',
  departure_time: '10:00',
  arrival_date: '2025-07-18',
  arrival_time: '12:00',
  seats: 10,
  price: 4000,
  base_price: 4000,
  travellers_count: 1,
  class_type: 'Economy',
};

describe('App', () => {

  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(['Delhi', 'Mumbai', 'Bengaluru']),
    }));

  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders Home component on default route "/"', async() => {
    await waitFor(()=>{
      render(
        <Provider store={store}>
          <MemoryRouter initialEntries={['/']}>
            <App />
          </MemoryRouter>
        </Provider>
      );
    })


    expect(screen.getByText('One Tap To Take Off')).toBeInTheDocument();
  });

  test('renders ConfirmBooking component on "/confirm-booking" route with location state', async() => {
    await waitFor(()=>{
      render(
        <Provider store={store}>
          <MemoryRouter
            initialEntries={[
              {
                pathname: '/confirm-booking',
                state: { flight: mockFlight },
              },
            ]}
          >
            <Routes>
              <Route path="/confirm-booking" element={<ConfirmBooking />} />
            </Routes>
          </MemoryRouter>
        </Provider>
      );
    })


    expect(screen.getByText(/Confirm Your Flight/i)).toBeInTheDocument();
  });
});
