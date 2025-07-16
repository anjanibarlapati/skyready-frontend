import { act, render, screen } from '@testing-library/react';
import { Home } from './Home';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { flightsReducer, type Alert } from '../../redux/flightsSlice';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import type { Flight } from '../../components/flight_result/FlightResult';

const renderHomeWithState = async (
  flights: Flight[],
  message = '',
  alert: Alert | null = null
) => {
  const mockStore = configureStore({
    reducer: {
      flights: flightsReducer,
    },
    preloadedState: {
      flights: {
        flights,
        message,
        alert,
      },
    },
  });
  await act(async () => {
    render(
      <Provider store={mockStore}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
  });

};

describe('Home component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(['Delhi', 'Mumbai', 'Bengaluru']),
    }));

  });

  afterEach(() => {
    vi.restoreAllMocks();
  });


  test('renders flight results if flights are available', async () => {
    await renderHomeWithState([
      {
        airline_name: 'Air India',
        flight_number: 'AI101',
        source: 'Delhi',
        destination: 'Mumbai',
        departure_date: '2025-07-18',
        departure_time: '10:00',
        arrival_date: '2025-07-18',
        arrival_time: '12:00',
        arrival_date_difference: '',
        seats: 5,
        price: 4500,
        base_price: 4000,
        travellers_count: 2,
        class_type: 'Economy',
      },
    ]);


    expect(screen.getByText(/Available Flights/i)).toBeInTheDocument();
    expect(screen.getByText(/Air India/i)).toBeInTheDocument();
  });

  test('renders message if no flights are found', async () => {
    await renderHomeWithState([], 'No flights found for the selected route');
    expect(screen.getByText(/No flights found/i)).toBeInTheDocument();
  });

  test('does not render flight result container if no flights or message', async () => {
    await renderHomeWithState([]);
    expect(screen.queryByText(/Available Flights/i)).not.toBeInTheDocument();
  });

  test('shows success alert and hides it after timeout', async () => {
    await renderHomeWithState([], '', { type: 'success', message: 'Booking confirmed!' });

    expect(screen.getByText(/Booking confirmed!/i)).toBeInTheDocument();
  });


  test('shows failure alert and hides it after timeout', async () => {
    await renderHomeWithState([], '', { type: 'failure', message: 'Booking failed!' });

    expect(screen.getByText(/Booking failed!/i)).toBeInTheDocument();
  });
});
