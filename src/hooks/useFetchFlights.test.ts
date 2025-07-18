import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  setFlights,
  setError,
  setMessage,
  clearFlights,
} from "../redux/flightsSlice";
import { useFetchFlights } from "./useFetchFlights";

const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

describe("useFetchFlights hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const searchData = {
    source: "Delhi",
    destination: "Mumbai",
    selectedDate: "2025-07-19",
    travellersCount: 2,
    classType: "Economy",
  };

  test("fetches flights successfully and dispatches setFlights", async () => {
    const fakeFlights = [
      {
        id: 1,
        airline_name: "Air India",
        flight_number: "AI101",
        departure_time: "10:00",
        arrival_time: "12:30",
        arrival_date_difference: "",
        source: "Delhi",
        destination: "Mumbai",
        seats: 5,
        price: 4500,
        departure_date: "2025-08-01",
        arrival_date: "2025-08-01",
        base_price: 4500,
        travellers_count: 2,
        class_type: "Economy",
      },
    ];

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(""));
    expect(mockDispatch).toHaveBeenCalledWith(setError(""));
    expect(mockDispatch).toHaveBeenCalledWith(setFlights(fakeFlights));
  });

  test("handles 409 response (no flights on date) and dispatches setMessage", async () => {
    const errorMessage = "No flights available on the selected date";

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({ message: errorMessage }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(""));
    expect(mockDispatch).toHaveBeenCalledWith(setError(""));
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(errorMessage));
  });

  test("handles other non-ok responses and dispatches setError", async () => {
    const errorMessage = "Internal server error";

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 422,
      json: vi.fn().mockResolvedValue({ message: errorMessage }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(""));
    expect(mockDispatch).toHaveBeenCalledWith(setError(""));
    expect(mockDispatch).toHaveBeenCalledWith(setError(errorMessage));
  });

  test("handles fetch network failure and dispatches default setError", async () => {
    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(""));
    expect(mockDispatch).toHaveBeenCalledWith(setError(""));
    expect(mockDispatch).toHaveBeenCalledWith(
      setError("Something went wrong while fetching flights")
    );
  });
});
