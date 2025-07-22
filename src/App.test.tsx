import { render, screen } from '@testing-library/react';
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
    vi.stubGlobal('fetch', vi.fn().mockImplementation((url: RequestInfo) => {
      if (typeof url === 'string' && url.includes('ipapi.co')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ country_code: 'IN' }),
        });
      }

      if (typeof url === 'string' && url.includes('/api/v1/cities')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(['Delhi', 'Mumbai', 'Bengaluru']),
        });
      }

      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      });
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders Home component on default route "/"', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter initialEntries={['/']}>
          <App />
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/One Tap To Take Off/i)).toBeInTheDocument();
  });

  test('renders ConfirmBooking component on "/confirm-booking" route with location state', async () => {
    render(
      <Provider store={store}>
        <MemoryRouter
          initialEntries={[
            {
              pathname: '/confirm-booking',
              state: { flight: mockFlight, price: mockFlight.price, symbol: '₹' },
            },
          ]}
        >
          <Routes>
            <Route path="/confirm-booking" element={<ConfirmBooking />} />
          </Routes>
        </MemoryRouter>
      </Provider>
    );

    expect(await screen.findByText(/Confirm Your Flight/i)).toBeInTheDocument();
    expect(screen.getByText(/AI202/)).toBeInTheDocument();
  });
});
