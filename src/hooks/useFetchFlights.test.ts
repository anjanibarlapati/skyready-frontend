import { act, renderHook } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { useFetchFlights } from "./useFetchFlights";
import { type SearchData } from "../redux/flightsSlice";
import {
  clearDepartureFlights,
  setDepartureError,
  setDepartureFlights,
  setDepartureMessage,
} from "../redux/departureFlightsSlice";
import {
  setReturnError,
  setReturnFlights,
  setReturnMessage,
} from "../redux/returnFlightsSlice";
import type { RootState } from "../redux/store";

const mockDispatch = vi.fn();
const mockUseSelector = vi.fn<(selector: (state: RootState) => "One Way" | "Round") => "One Way" | "Round">();


vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
    useSelector: (selector: (state: RootState) => "One Way" | "Round") =>
      mockUseSelector(selector),
  };
});

describe("useFetchFlights hook", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  const searchData: SearchData = {
    source: "Delhi",
    destination: "Mumbai",
    selectedDate: "2025-07-19",
    departureDate: "2025-07-19",
    returnDate: "2025-07-25",
    travellersCount: 2,
    classType: "Economy",
    tripType: "One Way",
  };

  const fakeFlights = [
    {
      id: 1,
      airline_name: "Air India",
      flight_number: "AI101",
      departure_time: "10:00",
      arrival_time: "12:30",
      source: "Delhi",
      destination: "Mumbai",
      departure_date: "2025-08-01",
      arrival_date: "2025-08-01",
      arrival_date_difference: "",
      seats: 5,
      price: 4500,
      base_price: 4500,
      travellers_count: 2,
      class_type: "Economy",
    },
  ];

  test("fetches departure flights successfully and dispatches setFlights", async () => {
    mockUseSelector.mockReturnValue("One Way");

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(clearDepartureFlights());
    expect(mockDispatch).toHaveBeenCalledWith(setDepartureMessage(""));
    expect(mockDispatch).toHaveBeenCalledWith(setDepartureError(""));
    expect(mockDispatch).toHaveBeenCalledWith(setDepartureFlights(fakeFlights));
  });

  test("dispatches setDepartureMessage on 409", async () => {
    mockUseSelector.mockReturnValue("One Way");

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 409,
      json: vi.fn().mockResolvedValue({ message: "No flights available" }),
    });

    const { result } = renderHook(() => useFetchFlights());
    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(setDepartureMessage("No flights available"));
  });

  test("dispatches setDepartureError on non-409 error", async () => {
    mockUseSelector.mockReturnValue("One Way");

    globalThis.fetch = vi.fn().mockResolvedValue({
      ok: false,
      status: 500,
      json: vi.fn().mockResolvedValue({ message: "Server error" }),
    });

    const { result } = renderHook(() => useFetchFlights());
    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(setDepartureError("Server error"));
  });

  test("handles network failure during departure fetch", async () => {
    mockUseSelector.mockReturnValue("One Way");

    globalThis.fetch = vi.fn().mockRejectedValue(new Error("Network down"));

    const { result } = renderHook(() => useFetchFlights());
    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(
      setDepartureError("Something went wrong while fetching departure flights")
    );
  });

  test("fetches return flights if tripType is 'Round'", async () => {
    mockUseSelector.mockReturnValue("Round");

    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      });

    const { result } = renderHook(() => useFetchFlights());

    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(setDepartureFlights(fakeFlights));
    expect(mockDispatch).toHaveBeenCalledWith(setReturnFlights(fakeFlights));
  });

  test("dispatches setReturnMessage on return 409", async () => {
    mockUseSelector.mockReturnValue("Round");

    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      })
      .mockResolvedValueOnce({
        ok: false,
        status: 409,
        json: vi.fn().mockResolvedValue({ message: "No return flights found" }),
      });

    const { result } = renderHook(() => useFetchFlights());
    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(setReturnMessage("No return flights found"));
  });

  test("dispatches setReturnError on return fetch failure", async () => {
    mockUseSelector.mockReturnValue("Round");

    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      })
      .mockRejectedValueOnce(new Error("Return fetch failed"));

    const { result } = renderHook(() => useFetchFlights());
    await act(() => result.current.fetchFlights(searchData));

    expect(mockDispatch).toHaveBeenCalledWith(
      setReturnError("Something went wrong while fetching return flights")
    );
  });

  test("fetches both departure and return when type is 'both'", async () => {
    mockUseSelector.mockReturnValue("Round");

    globalThis.fetch = vi.fn()
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
      });

    const { result } = renderHook(() => useFetchFlights());

    await act(() => result.current.fetchFlights(searchData, "both"));

    expect(mockDispatch).toHaveBeenCalledWith(setDepartureFlights(fakeFlights));
    expect(mockDispatch).toHaveBeenCalledWith(setReturnFlights(fakeFlights));
  });
});
