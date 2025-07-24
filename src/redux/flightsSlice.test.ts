import { describe, test, expect } from "vitest";
import {
  flightsReducer,
  setAlert,
  clearAlert,
  setSearchData,
  setLoading,
  setTripType,
} from "./flightsSlice";

import type { Alert, FlightsState, SearchData } from "./flightsSlice";

describe("flightsSlice reducer", () => {
  const initialDate = new Date().toLocaleDateString("en-CA").split("T")[0];

  const initialState: FlightsState = {
    alert: null,
    loading: false,
    searchData: {
      selectedDate: initialDate,
      departureDate: initialDate,
      source: "",
      destination: "",
      travellersCount: 1,
      classType: "Economy",
      tripType: "One Way",
    },
    tripType: "One Way",
  };

  test("setAlert should update the alert object", () => {
    const alert: Alert = {
      type: "success",
      message: "Booking confirmed",
    };
    const nextState = flightsReducer(initialState, setAlert(alert));
    expect(nextState.alert).toEqual(alert);
  });

  test("clearAlert should reset alert to null", () => {
    const alertState = flightsReducer(initialState, setAlert({ type: "failure", message: "Something went wrong" }));
    const nextState = flightsReducer(alertState, clearAlert());
    expect(nextState.alert).toBeNull();
  });

  test("setSearchData should replace the searchData", () => {
    const newSearchData: SearchData = {
      selectedDate: "2025-08-15",
      departureDate: "2025-08-15",
      source: "Mumbai",
      destination: "Goa",
      travellersCount: 2,
      classType: "Business",
      tripType: "One Way",
    };
    const nextState = flightsReducer(initialState, setSearchData(newSearchData));
    expect(nextState.searchData).toEqual(newSearchData);
  });

  test("setLoading should toggle the loading flag", () => {
    const loadingState = flightsReducer(initialState, setLoading(true));
    expect(loadingState.loading).toBe(true);

    const idleState = flightsReducer(loadingState, setLoading(false));
    expect(idleState.loading).toBe(false);
  });

  test("setTripType should update the tripType in state", () => {
    const roundTripState = flightsReducer(initialState, setTripType("Round"));
    expect(roundTripState.tripType).toBe("Round");

    const oneWayState = flightsReducer(roundTripState, setTripType("One Way"));
    expect(oneWayState.tripType).toBe("One Way");
  });
});
