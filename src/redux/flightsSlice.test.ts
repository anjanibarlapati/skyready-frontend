import { describe, expect, test } from "vitest";
import type { Flight } from "../components/flight_result/FlightResult";
import type { Alert } from "./flightsSlice";
import {
  clearAlert,
  clearFlights,
  flightsReducer,
  setAlert,
  setError,
  setFlights,
  setLoading,
  setMessage,
  setSearchData,
} from "./flightsSlice";
describe("flightsSlice reducer", () => {
  const mockFlights: Flight[] = [
    {
      airline_name: "IndiGo",
      flight_number: "6E101",
      source: "Delhi",
      destination: "Mumbai",
      departure_date: "2025-08-01",
      departure_time: "09:00",
      arrival_date: "2025-08-01",
      arrival_time: "11:00",
      arrival_date_difference: "",
      seats: 10,
      price: 5000,
      base_price: 4500,
      travellers_count: 2,
      class_type: "Economy",
    },
  ];

  const initialSearchData = {
    selectedDate: new Date().toISOString().split("T")[0],
    source: "",
    destination: "",
    travellersCount: 1,
    classType: "Economy",
  };

  const initialState = {
    flights: [],
    message: "",
    error: "",
    alert: null,
    loading: false,
    searchData: initialSearchData,
  };
  test("setFlights should update the flights array", () => {
    const nextState = flightsReducer(initialState, setFlights(mockFlights));
    expect(nextState.flights).toEqual(mockFlights);
  });
  test("clearFlights should empty the flights array", () => {
    const stateWithFlights = { ...initialState, flights: mockFlights };
    const nextState = flightsReducer(stateWithFlights, clearFlights());
    expect(nextState.flights).toEqual([]);
  });
  test("setMessage should set the message string", () => {
    const message = "No flights available";
    const nextState = flightsReducer(initialState, setMessage(message));
    expect(nextState.message).toBe(message);
  });
  test("setAlert should set alert object", () => {
    const alert: Alert = {
      type: "success",
      message: "Flight booked!",
    };
    const nextState = flightsReducer(initialState, setAlert(alert));
    expect(nextState.alert).toEqual(alert);
  });
  test("clearAlert should reset alert to null", () => {
    const nextState = flightsReducer(initialState, clearAlert());
    expect(nextState.alert).toBeNull();
  });
  test("setSearchData should update part of searchData", () => {
    const partialUpdate = {
      source: "Delhi",
      destination: "Mumbai",
    };
    const nextState = flightsReducer(
      initialState,
      setSearchData(partialUpdate)
    );
    expect(nextState.searchData.source).toBe("Delhi");
    expect(nextState.searchData.destination).toBe("Mumbai");
    expect(nextState.searchData.classType).toBe(initialSearchData.classType);
  });
  test("setSearchData should replace full searchData if provided", () => {
    const newSearchData = {
      selectedDate: "2025-08-15",
      source: "Hyderabad",
      destination: "Bangalore",
      travellersCount: 3,
      classType: "First Class",
    };
    const nextState = flightsReducer(
      initialState,
      setSearchData(newSearchData)
    );
    expect(nextState.searchData).toEqual(newSearchData);
  });

  test("setError should set the error string", () => {
  const error = "Something went wrong";
  const nextState = flightsReducer(initialState, setError(error));
  expect(nextState.error).toBe(error);
  });

  test("setLoading should toggle loading flag", () => {
    const nextState = flightsReducer(initialState, setLoading(true));
    expect(nextState.loading).toBe(true);

    const finalState = flightsReducer(nextState, setLoading(false));
    expect(finalState.loading).toBe(false);
  });
});