import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { beforeEach, describe, expect, test, vi, afterEach } from "vitest";

import { ConfirmBooking } from "./ConfirmBooking";
import { setAlert } from "../../redux/flightsSlice";
import { clearDepartureFlights } from "../../redux/departureFlightsSlice";
import { clearReturnFlights } from "../../redux/returnFlightsSlice";
import { store } from "../../redux/store";
import type { Location } from "react-router-dom";

const mockDispatch = vi.fn();
const mockNavigate = vi.fn();

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

const mockReturnFlight = {
  ...mockFlight,
  flight_number: "AI202",
  source: "Mumbai",
  destination: "Delhi",
  departure_date: "2025-08-05",
  departure_time: "14:00",
};

let mockLocationState = {};

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual<typeof import("react-router-dom")>("react-router-dom");
  return {
    ...actual,
    useLocation: (): Location => ({
      pathname: "/confirm-booking",
      search: "",
      hash: "",
      key: "mock-key",
      state: mockLocationState,
    }),
    useNavigate: () => mockNavigate,
  };
});

const renderConfirmBooking = () =>
  render(
    <Provider store={store}>
      <MemoryRouter initialEntries={["/confirm-booking"]}>
        <Routes>
          <Route path="/" element={<div>Home Page</div>} />
          <Route path="/confirm-booking" element={<ConfirmBooking />} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );

describe("ConfirmBooking Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockDispatch.mockClear();
    mockNavigate.mockClear();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  const oneWayState = {
    flight: mockFlight,
    price: 5000,
    basePrice: 4500,
    symbol: "₹",
    currency: "INR",
  };

  const roundTripState = {
    ...oneWayState,
    returnFlight: mockReturnFlight,
    returnFlightPrice: 4000,
    returnFlightBasePrice: 3600,
  };

  test("renders one-way booking UI with fare summary", () => {
    mockLocationState = oneWayState;
    renderConfirmBooking();

    expect(screen.getByText("Confirm Your Flight")).toBeInTheDocument();
    expect(screen.getByText("Fare Summary")).toBeInTheDocument();
    expect(screen.getByText("Base Fare")).toBeInTheDocument();
    expect(screen.getByText("Taxes & Fees")).toBeInTheDocument();
    expect(screen.getByText("Total")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Confirm Booking/i })).toBeInTheDocument();
  });

  test("shows success alert on successful one-way booking", async () => {
    mockLocationState = oneWayState;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Booking successful" }),
    }));

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setAlert({
        type: "success",
        message: "🎉 Booking confirmed successfully!",
      }));
      expect(mockDispatch).toHaveBeenCalledWith(clearDepartureFlights());
      expect(mockDispatch).toHaveBeenCalledWith(clearReturnFlights());
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows failure alert when booking fails", async () => {
    mockLocationState = oneWayState;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: false,
      json: async () => ({ message: "Booking failed" }),
    }));

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setAlert({
        type: "failure",
        message: "❌ Booking failed",
      }));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows network error alert on fetch rejection", async () => {
    mockLocationState = oneWayState;
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("Network error")));

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setAlert({
        type: "failure",
        message: "❌ Network error. Please try again.",
      }));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("renders and confirms round-trip booking", async () => {
    mockLocationState = roundTripState;
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: "Round-trip booked" }),
    }));

    renderConfirmBooking();
    fireEvent.click(screen.getByRole("button", { name: /Confirm Booking/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setAlert({
        type: "success",
        message: "🎉 Booking confirmed successfully!",
      }));
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });
});
