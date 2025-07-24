import { describe, test, expect } from "vitest";
import {
  departureFlightsReducer,
  setDepartureFlights,
  clearDepartureFlights,
  setDepartureError,
  setDepartureMessage,
} from "./departureFlightsSlice";
import type { Flight } from "../components/flight_result/FlightResult";

describe("departureFlightsSlice reducer", () => {
  const mockFlights: Flight[] = [
    {
      airline_name: "Vistara",
      flight_number: "UK701",
      source: "Bangalore",
      destination: "Delhi",
      departure_date: "2025-08-10",
      departure_time: "10:00",
      arrival_date: "2025-08-10",
      arrival_time: "12:30",
      arrival_date_difference: "",
      seats: 12,
      price: 5500,
      base_price: 4800,
      travellers_count: 1,
      class_type: "Business",
    },
  ];

  const initialState = {
    departureFlights: [],
    departureMessage: "",
    departureError: "",
  };

  test("setDepartureFlights should update departureFlights array", () => {
    const nextState = departureFlightsReducer(initialState, setDepartureFlights(mockFlights));
    expect(nextState.departureFlights).toEqual(mockFlights);
  });

  test("clearDepartureFlights should empty departureFlights array", () => {
    const stateWithFlights = { ...initialState, departureFlights: mockFlights };
    const nextState = departureFlightsReducer(stateWithFlights, clearDepartureFlights());
    expect(nextState.departureFlights).toEqual([]);
  });

  test("setDepartureMessage should update departureMessage", () => {
    const message = "Departure flights loaded";
    const nextState = departureFlightsReducer(initialState, setDepartureMessage(message));
    expect(nextState.departureMessage).toBe(message);
  });

  test("setDepartureError should update departureError", () => {
    const error = "Failed to fetch departure flights";
    const nextState = departureFlightsReducer(initialState, setDepartureError(error));
    expect(nextState.departureError).toBe(error);
  });
});
