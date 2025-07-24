import { describe, test, expect } from "vitest";
import { returnFlightsReducer, setReturnFlights, clearReturnFlights, setReturnError, setReturnMessage } from "./returnFlightsSlice";
import type { Flight } from "../components/flight_result/FlightResult";

describe("returnFlightsSlice reducer", () => {
  const mockFlights: Flight[] = [
    {
      airline_name: "Air India",
      flight_number: "AI202",
      source: "Mumbai",
      destination: "Delhi",
      departure_date: "2025-08-15",
      departure_time: "18:00",
      arrival_date: "2025-08-15",
      arrival_time: "20:00",
      arrival_date_difference: "",
      seats: 8,
      price: 5200,
      base_price: 4700,
      travellers_count: 2,
      class_type: "Economy",
    },
  ];

  const initialState = {
    returnFlights: [],
    returnMessage: "",
    returnError: "",
  };

  test("setReturnFlights should update returnFlights array", () => {
    const nextState = returnFlightsReducer(initialState, setReturnFlights(mockFlights));
    expect(nextState.returnFlights).toEqual(mockFlights);
  });

  test("clearReturnFlights should empty returnFlights array", () => {
    const stateWithFlights = { ...initialState, returnFlights: mockFlights };
    const nextState = returnFlightsReducer(stateWithFlights, clearReturnFlights());
    expect(nextState.returnFlights).toEqual([]);
  });

  test("setReturnMessage should update returnMessage", () => {
    const message = "Return flights loaded";
    const nextState = returnFlightsReducer(initialState, setReturnMessage(message));
    expect(nextState.returnMessage).toBe(message);
  });

  test("setReturnError should update returnError", () => {
    const error = "Failed to fetch return flights";
    const nextState = returnFlightsReducer(initialState, setReturnError(error));
    expect(nextState.returnError).toBe(error);
  });
});
