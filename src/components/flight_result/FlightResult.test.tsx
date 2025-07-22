import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { FlightResult, type Flight } from "./FlightResult";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { currencyReducer } from "../../redux/currencySlice";

const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const mockFlight: Flight = {
  airline_name: "IndiGo",
  flight_number: "6E123",
  departure_time: "08:00 AM",
  arrival_time: "10:30 AM",
  arrival_date_difference: "+1 day",
  departure_date: "2025-07-20",
  arrival_date: "2025-07-20",
  source: "Delhi",
  destination: "Mumbai",
  seats: 5,
  price: 3500,
  base_price: 3000,
  travellers_count: 2,
  class_type: "Economy",
};

const renderWithProviders = (flight: Flight, currency: string = "INR") => {
  const store = configureStore({
    reducer: {
      currency: currencyReducer,
    },
    preloadedState: {
      currency: { currency },
    },
  });

  render(
    <Provider store={store}>
      <MemoryRouter>
        <FlightResult flight={flight} />
      </MemoryRouter>
    </Provider>
  );
};

describe("FlightResult component", () => {
  test("renders all flight details correctly", () => {
    renderWithProviders(mockFlight);

    expect(screen.getByText("IndiGo")).toBeInTheDocument();
    expect(screen.getByText("6E123")).toBeInTheDocument();
    expect(screen.getByText(/🛫 08:00 AM/)).toBeInTheDocument();
    expect(screen.getByText("Delhi")).toBeInTheDocument();
    expect(screen.getByText(/🛬 10:30 AM/)).toBeInTheDocument();
    expect(screen.getByText("Mumbai")).toBeInTheDocument();
    expect(screen.getByText("Seats Available")).toBeInTheDocument();
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("₹ 3,500")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
  });

  test("does not show arrival_date_difference if not provided", () => {
    const flightWithoutDateDiff: Flight = {
      ...mockFlight,
      arrival_date_difference: undefined,
    };

    renderWithProviders(flightWithoutDateDiff);

    expect(screen.queryByText("+1 day")).not.toBeInTheDocument();
  });

  test("formats price correctly with commas", () => {
    const expensiveFlight: Flight = {
      ...mockFlight,
      price: 125000,
    };

    renderWithProviders(expensiveFlight);

    expect(screen.getByText("₹ 1,25,000")).toBeInTheDocument();
  });

  test("navigates to /confirm-booking with correct state on Book button click", () => {
    renderWithProviders(mockFlight);

    fireEvent.click(screen.getByRole("button", { name: "Book" }));

    expect(mockNavigate).toHaveBeenCalledWith("/confirm-booking", {
      state: {
        flight: mockFlight,
        price: 3500,
        basePrice: 3000,
        symbol: "₹",
        currency: 'INR'
      },
    });
  });

  test("uses correct currency and conversion when selected currency is USD", () => {
    renderWithProviders(mockFlight, "USD");

    const expectedPrice = 3500 * 0.0116;
    const expectedBasePrice = 3000 * 0.0116;

    fireEvent.click(screen.getByRole("button", { name: "Book" }));

    expect(mockNavigate).toHaveBeenCalledWith("/confirm-booking", {
      state: {
        flight: mockFlight,
        price: expectedPrice,
        basePrice: expectedBasePrice,
        symbol: "$",
        currency: 'USD'
      },
    });

    expect(
      screen.getByText(`$ ${expectedPrice.toLocaleString('en-IN', { maximumFractionDigits: 2 })}`)
    ).toBeInTheDocument();
  });
});
