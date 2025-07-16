import { render, screen } from '@testing-library/react';
import { FlightCard } from './FlightCard';
import type { Flight } from '../flight_result/FlightResult';
import { describe, test, expect } from 'vitest';

const mockFlight: Flight = {
  airline_name: 'IndiGo',
  flight_number: '6E123',
  source: 'Delhi',
  destination: 'Mumbai',
  departure_date: '2025-07-18',
  departure_time: '14:30',
  arrival_date: '2025-07-18',
  arrival_time: '16:45',
  arrival_date_difference: '',
  seats: 5,
  price: 5200,
  base_price: 4800,
  travellers_count: 2,
  class_type: 'Economy',
};

describe('FlightCard', () => {
  test('renders airline name and flight number', () => {
    render(<FlightCard flight={mockFlight} />);
    expect(screen.getByText('IndiGo')).toBeInTheDocument();
    expect(screen.getByText('6E123')).toBeInTheDocument();
  });

  test('renders source and destination cities', () => {
    render(<FlightCard flight={mockFlight} />);
    expect(screen.getAllByText('Delhi')[0]).toBeInTheDocument();
    expect(screen.getAllByText('Mumbai')[0]).toBeInTheDocument();
  });

  test('renders formatted departure and arrival dates', () => {
    render(<FlightCard flight={mockFlight} />);
    expect(screen.getAllByText('18 Jul').length).toBeGreaterThanOrEqual(1);
  });

  test('renders departure and arrival times', () => {
    render(<FlightCard flight={mockFlight} />);
    expect(screen.getByText('14:30')).toBeInTheDocument();
    expect(screen.getByText('16:45')).toBeInTheDocument();
  });

  test('renders price with ₹ symbol', () => {
    render(<FlightCard flight={mockFlight} />);
    expect(screen.getByText(/₹ 5200/)).toBeInTheDocument();
  });

  test('renders duration label', async () => {
    render(<FlightCard flight={mockFlight} />);
    expect(await screen.findByText(/2h 15m|02h 15m/i)).toBeInTheDocument();
  });

  test('renders journey path line image', () => {
    render(<FlightCard flight={mockFlight} />);
    const lineImg = screen.getByAltText('line');
    expect(lineImg).toBeInTheDocument();
    expect(lineImg.tagName).toBe('IMG');
  });
});
