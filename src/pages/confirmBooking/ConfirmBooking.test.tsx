import { configureStore } from "@reduxjs/toolkit";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi } from "vitest";
import {
  clearFlights,
  flightsReducer,
  setAlert,
} from "../../redux/flightsSlice";
import { ConfirmBooking } from "./ConfirmBooking";

const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>(
    "react-redux"
  );
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const mockFlight = {
  flight_number: "AI101",
  airline_name: "Air India",
  departure_time: "10:00",
  arrival_time: "12:30",
  arrival_date_difference: "",
  source: "Delhi",
  destination: "Mumbai",
  departure_date: "2025-08-01",
  arrival_date: "2025-08-01",
  seats: 5,
  price: 5000,
  base_price: 4500,
  travellers_count: 2,
  class_type: "Economy",
};

const createMockStore = () =>
  configureStore({
    reducer: { flights: flightsReducer },
    preloadedState: {
      flights: {
        flights: [],
        message: "",
        alert: null,
        searchData: {
          selectedDate: new Date().toISOString().split("T")[0],
          source: "",
          destination: "",
          travellersCount: 1,
          classType: "Economy",
        },
      },
    },
  });

const renderConfirmBooking = () => {
  return render(
    <Provider store={createMockStore()}>
      <MemoryRouter
        initialEntries={[
          { pathname: "/confirm-booking", state: { flight: mockFlight } },
        ]}
      >
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe("ConfirmBooking Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockDispatch.mockClear();
  });

  test("renders flight details and fare summary", async () => {
    renderConfirmBooking();

    expect(screen.getByText("Confirm Your Flight")).toBeInTheDocument();
    expect(screen.getByText("Fare Summary")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Confirm Booking/i })
    ).toBeInTheDocument();
  });

  test("successful booking dispatches success alert and clears flights", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ message: "Booking successful" }),
      })
    );

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setAlert({
          type: "success",
          message: "🎉 Booking confirmed successfully!",
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    });
  });

  test("failed booking dispatches failure alert", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: false,
        json: async () => ({ message: "Booking failed" }),
      })
    );

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setAlert({ type: "failure", message: "❌ Booking failed" })
      );
      expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    });
  });

  test("network error shows fallback alert", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockRejectedValue(new Error("Network error"))
    );

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setAlert({
          type: "failure",
          message: "❌ Network error. Please try again.",
        })
      );
      expect(mockDispatch).toHaveBeenCalledWith(clearFlights());
    });
  });
});