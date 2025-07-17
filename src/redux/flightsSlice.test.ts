import {
  flightsReducer,
  setFlights,
  setMessage,
  setAlert,
  clearAlert,
  clearFlights,
  setSearchData,
} from './flightsSlice';
import type { Flight } from '../components/flight_result/FlightResult';
import type { Alert } from './flightsSlice';
import { describe, test, expect } from 'vitest';

describe('flightsSlice reducer', () => {
  const mockFlights: Flight[] = [
    {
      airline_name: 'IndiGo',
      flight_number: '6E101',
      source: 'Delhi',
      destination: 'Mumbai',
      departure_date: '2025-08-01',
      departure_time: '09:00',
      arrival_date: '2025-08-01',
      arrival_time: '11:00',
      arrival_date_difference: '',
      seats: 10,
      price: 5000,
      base_price: 4500,
      travellers_count: 2,
      class_type: 'Economy',
    },
  ];

  const initialSearchData = {
    selectedDate: new Date().toISOString().split('T')[0],
    source: '',
    destination: '',
    travellersCount: 1,
    classType: 'Economy',
  };

  const initialState = {
    flights: [],
    message: '',
    alert: null,
    searchData: initialSearchData,
  };

  test('setFlights should update the flights array', () => {
    const nextState = flightsReducer(initialState, setFlights(mockFlights));
    expect(nextState.flights).toEqual(mockFlights);
  });

  test('clearFlights should empty the flights array', () => {
    const stateWithFlights = { ...initialState, flights: mockFlights };
    const nextState = flightsReducer(stateWithFlights, clearFlights());
    expect(nextState.flights).toEqual([]);
  });

  test('setMessage should set the message string', () => {
    const message = 'No flights available';
    const nextState = flightsReducer(initialState, setMessage(message));
    expect(nextState.message).toBe(message);
  });

  test('setAlert should set alert object', () => {
    const alert: Alert = {
      type: 'success',
      message: 'Flight booked!',
    };
    const nextState = flightsReducer(initialState, setAlert(alert));
    expect(nextState.alert).toEqual(alert);
  });

  test('clearAlert should reset alert to null', () => {
    const nextState = flightsReducer(initialState, clearAlert());
    expect(nextState.alert).toBeNull();
  });

  test('setSearchData should update part of searchData', () => {
    const partialUpdate = {
      source: 'Delhi',
      destination: 'Mumbai',
    };

    const nextState = flightsReducer(initialState, setSearchData(partialUpdate));
    expect(nextState.searchData.source).toBe('Delhi');
    expect(nextState.searchData.destination).toBe('Mumbai');
    expect(nextState.searchData.classType).toBe(initialSearchData.classType); // unchanged
  });

  test('setSearchData should replace full searchData if provided', () => {
    const newSearchData = {
      selectedDate: '2025-08-15',
      source: 'Hyderabad',
      destination: 'Bangalore',
      travellersCount: 3,
      classType: 'First Class',
    };

    const nextState = flightsReducer(initialState, setSearchData(newSearchData));
    expect(nextState.searchData).toEqual(newSearchData);
  });
});
