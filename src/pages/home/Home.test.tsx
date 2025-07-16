import { render, screen} from '@testing-library/react';
import { Home } from './Home';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { flightsReducer } from '../../redux/flightsSlice';
import { describe, test, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Flight } from '../../components/flight_result/FlightResult';


const renderHomeWithState = (flights: Flight[], message = '') => {
  const mockStore = configureStore({
    reducer: {
      flights: flightsReducer,
    },
    preloadedState: {
      flights: {
        flights,
        message,
        searchData: {
          selectedDate: new Date().toISOString().split("T")[0],
          source: "",
          destination: "",
          travellersCount: 1,
          classType: "Economy",
        },
      },
    },
  });

  render(
    <Provider store={mockStore}>
      <Home />
    </Provider>
  );
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

  test('renders home container', async () => {
    await renderHomeWithState([]);
    expect(screen.getByTestId('home')).toBeInTheDocument();
  });

  test('renders flight results if flights are available', async () => {
    await renderHomeWithState([
      {
        airline_name: 'Air India',
        flight_number: 'AI101',
        departure_time: '10:00',
        arrival_time: '12:00',
        arrival_date_difference: '',
        source: 'Delhi',
        destination: 'Mumbai',
        seats: 5,
        price: 4500,
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
});
