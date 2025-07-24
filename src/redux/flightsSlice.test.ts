import { describe, test, expect } from "vitest";
import {
  flightsReducer,
  setAlert,
  clearAlert,
  setSearchData,
  setLoading,
} from "./flightsSlice";

import type { Alert } from "./flightsSlice";

describe("flightsSlice reducer", () => {
  const initialDate = new Date().toLocaleDateString("en-CA").split("T")[0];

  const initialState = {
    alert: null,
    loading: false,
    searchData: {
      selectedDate: initialDate,
      departureDate: initialDate,
      source: "",
      destination: "",
      travellersCount: 1,
      classType: "Economy",
    },
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
    const nextState = flightsReducer(initialState, clearAlert());
    expect(nextState.alert).toBeNull();
  });

  test("setSearchData should replace the searchData", () => {
    const newSearchData = {
      selectedDate: "2025-08-15",
      departureDate: "2025-08-15",
      source: "Mumbai",
      destination: "Goa",
      travellersCount: 2,
      classType: "Business",
    };
    const nextState = flightsReducer(initialState, setSearchData(newSearchData));
    expect(nextState.searchData).toEqual(newSearchData);
  });

  test("setLoading should update loading to true or false", () => {
    const loadingState = flightsReducer(initialState, setLoading(true));
    expect(loadingState.loading).toBe(true);

    const idleState = flightsReducer(loadingState, setLoading(false));
    expect(idleState.loading).toBe(false);
  });
});
