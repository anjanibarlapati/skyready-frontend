import { configureStore } from '@reduxjs/toolkit';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import type { Flight } from '../../components/flight_result/FlightResult';
import { currencyReducer } from '../../redux/currencySlice';
import { departureFlightsReducer } from '../../redux/departureFlightsSlice';
import { flightsReducer, type Alert } from '../../redux/flightsSlice';
import { returnFlightsReducer } from '../../redux/returnFlightsSlice';
import { Home } from './Home';

const createMockFlight = (overrides?: Partial<Flight>): Flight => ({
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
  travellers_count: 1,
  class_type: 'Economy',
  ...overrides,
});

const renderHomeWithState = async ({
  departureFlights = [],
  returnFlights = [],
  alert = null,
  departureMessage = '',
  returnMessage = '',
  departureError = '',
  returnError = '',
  loading = false,
  currency = 'INR',
}: {
  departureFlights?: Flight[];
  returnFlights?: Flight[];
  alert?: Alert | null;
  departureMessage?: string;
  returnMessage?: string;
  departureError?: string;
  returnError?: string;
  loading?: boolean;
  currency?: string;
}) => {
  const store = configureStore({
    reducer: {
      flights: flightsReducer,
      currency: currencyReducer,
      departureFlights: departureFlightsReducer,
      returnFlights: returnFlightsReducer,
    },
    preloadedState: {
      flights: {
        alert,
        loading,
        searchData: {
          selectedDate: new Date().toISOString().split("T")[0],
          departureDate: new Date().toISOString().split("T")[0],
          selectedReturnDate: new Date().toISOString().split("T")[0],
          source: 'DEL',
          destination: 'BOM',
          travellersCount: 1,
          classType: 'Economy',
          tripType: 'Round' as 'One Way' | 'Round',
        },
        tripType: 'Round' as 'One Way'|'Round',
      },
      currency: { currency },
      departureFlights: { departureFlights, departureMessage, departureError },
      returnFlights: { returnFlights, returnMessage, returnError },
    },
  });

  await act(async () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <Home />
        </MemoryRouter>
      </Provider>
    );
  });
};

describe('Home Component', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(['Delhi', 'Mumbai']),
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('renders both departure and return flights', async () => {
    const depFlight = createMockFlight({ flight_number: 'AI101' });
    const retFlight = createMockFlight({ flight_number: 'AI102', source: 'Mumbai', destination: 'Delhi' });

    await renderHomeWithState({
      departureFlights: [depFlight],
      returnFlights: [retFlight],
    });

    expect(screen.getByText(/Available Flights/i)).toBeInTheDocument();
    expect(screen.getByText(/Air India/i)).toBeInTheDocument();
    expect(screen.getAllByText(/DEL/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/BOM/).length).toBeGreaterThan(0);
  });

 test('can switch tabs between departure and return', async () => {
  const depFlight = createMockFlight({ flight_number: 'AI101' });
  const retFlight = createMockFlight({ flight_number: 'AI102', source: 'Mumbai', destination: 'Delhi' });

  await renderHomeWithState({
    departureFlights: [depFlight],
    returnFlights: [retFlight],
  });

  const tabs = screen.getAllByRole('button', { name: /DEL|BOM/ });

  expect(tabs[0]).toHaveClass('active');
  expect(tabs[1]).not.toHaveClass('active');

  fireEvent.click(tabs[1]);
  expect(tabs[1]).toHaveClass('active');
  expect(tabs[0]).not.toHaveClass('active');
});

  test('renders message if no departure flights found', async () => {
    await renderHomeWithState({
      departureFlights: [],
      departureMessage: 'No departure flights',
      returnFlights: [createMockFlight()],
    });

    expect(screen.getByText(/No departure flights/i)).toBeInTheDocument();
  });

  test('renders return error message', async () => {
    await renderHomeWithState({
      departureFlights: [createMockFlight()],
      returnFlights: [],
      returnError: 'Internal server error',
    });

    const bomTabs = screen.getAllByText(/BOM/);
    const returnTab = bomTabs[1];
    fireEvent.click(returnTab);
  });

  test('shows loading spinner', async () => {
    await renderHomeWithState({
      loading: true,
      departureFlights: [],
      returnFlights: [],
    });

    expect(screen.getByTestId('spinner')).toBeInTheDocument();
  });

  test('shows success alert', async () => {
    await renderHomeWithState({
      alert: { type: 'success', message: 'Booking confirmed!' },
    });

    expect(screen.getByText(/Booking confirmed!/i)).toBeInTheDocument();
  });

  test('shows failure alert', async () => {
    await renderHomeWithState({
      alert: { type: 'failure', message: 'Booking failed!' },
    });

    expect(screen.getByText(/Booking failed!/i)).toBeInTheDocument();
  });

  test('Book button is disabled unless both flights selected', async () => {
    const depFlight = createMockFlight({ flight_number: 'AI101' });
    const retFlight = createMockFlight({ flight_number: 'AI102', source: 'Mumbai', destination: 'Delhi' });

    await renderHomeWithState({
    departureFlights: [depFlight],
    returnFlights: [retFlight],
    });

    const bomElements = screen.getAllByText(/BOM/);
    fireEvent.click(bomElements[1]); 

    const bookButton = screen.getByRole('button', { name: /Book/i });
    expect(bookButton).toBeDisabled();
  });

});
