import { describe, test, expect, vi, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useFetchFlights } from "./useFetchFlights";
import { setFlights, setMessage } from "../redux/flightsSlice";

const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = (await vi.importActual<typeof import("react-redux")>("react-redux"));
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
      },
    ];

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ flights: fakeFlights }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(global.fetch).toHaveBeenCalledWith(
      `${import.meta.env.VITE_BASE_URL}/api/v1/flights/search`,
      expect.objectContaining({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: searchData.source,
          destination: searchData.destination,
          departure_date: searchData.selectedDate,
          travellers_count: searchData.travellersCount,
          class_type: searchData.classType,
        }),
      })
    );

    expect(mockDispatch).toHaveBeenCalledWith(setFlights(fakeFlights));
    expect(mockDispatch).not.toHaveBeenCalledWith(setMessage(expect.anything()));
  });

  test("handles non-ok response and dispatches setFlights([]) and setMessage", async () => {
    const errorMessage = "No flights available";

    global.fetch = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockResolvedValue({ message: errorMessage }),
    });

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(setFlights([]));
    expect(mockDispatch).toHaveBeenCalledWith(setMessage(errorMessage));
  });

  test("handles fetch error and dispatches setMessage", async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error("Network error"));

    const { result } = renderHook(() => useFetchFlights());

    await act(async () => {
      await result.current.fetchFlights(searchData);
    });

    expect(mockDispatch).toHaveBeenCalledWith(
      setMessage("Something went wrong while fetching flights.")
    );
  });
});
