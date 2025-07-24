import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { FlightResult, type Flight } from "./FlightResult";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { currencyReducer } from "../../redux/currencySlice";
import { getCurrencySymbol, formatCurrency, convertFromINR } from "../../utils/currencyUtils";

const mockNavigate = vi.fn();
const mockOnSelect = vi.fn();

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

const renderWithProviders = (
  flight: Flight,
  {
    currency = "INR",
    tripType = "One Way",
    selected = false,
    onSelect = mockOnSelect,
  }: {
    currency?: string;
    tripType?: "One Way" | "Round";
    selected?: boolean;
    onSelect?: () => void;
  } = {}
) => {
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
        <FlightResult
          flight={flight}
          onSelect={onSelect}
          tripType={tripType}
          selected={selected}
        />
      </MemoryRouter>
    </Provider>
  );
};

describe("FlightResult", () => {
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

    const symbol = getCurrencySymbol("INR");
    const formattedPrice = formatCurrency(3500, "INR");
    expect(screen.getByText(`${symbol} ${formattedPrice}`)).toBeInTheDocument();

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

  test("formats large price correctly in INR", () => {
    const expensiveFlight: Flight = {
      ...mockFlight,
      price: 125000,
    };

    renderWithProviders(expensiveFlight);
    const symbol = getCurrencySymbol("INR");
    const formatted = formatCurrency(125000, "INR");

    expect(screen.getByText(`${symbol} ${formatted}`)).toBeInTheDocument();
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
        currency: "INR",
      },
    });
  });

  test("formats and converts prices correctly for USD", () => {
    renderWithProviders(mockFlight, { currency: "USD" });

    const convertedPrice = convertFromINR(mockFlight.price, "USD");
    const formatted = formatCurrency(convertedPrice, "USD");
    const symbol = getCurrencySymbol("USD");

    expect(screen.getByText(`${symbol} ${formatted}`)).toBeInTheDocument();

    fireEvent.click(screen.getByRole("button", { name: "Book" }));

    const convertedBasePrice = convertFromINR(mockFlight.base_price, "USD");

    expect(mockNavigate).toHaveBeenCalledWith("/confirm-booking", {
      state: {
        flight: mockFlight,
        price: convertedPrice,
        basePrice: convertedBasePrice,
        symbol: symbol,
        currency: "USD",
      },
    });
  });

  test("calls onSelect if tripType is Round", () => {
    renderWithProviders(mockFlight, { tripType: "Round" });

    const card = screen.getByText("IndiGo").closest(".flight-card")!;
    fireEvent.click(card);

    expect(mockOnSelect).toHaveBeenCalled();
  });

  test("does not render Book button if tripType is Round", () => {
    renderWithProviders(mockFlight, { tripType: "Round" });
    expect(screen.queryByRole("button", { name: "Book" })).not.toBeInTheDocument();
  });

  test("adds selected-card class when selected is true", () => {
    renderWithProviders(mockFlight, { selected: true });

    const card = screen.getByText("IndiGo").closest(".flight-card");
    expect(card?.classList.contains("selected-card")).toBe(true);
  });

  test("formats price correctly for EUR locale", () => {
    renderWithProviders(mockFlight, { currency: "EUR" });

    const converted = convertFromINR(mockFlight.price, "EUR");
    const formatted = formatCurrency(converted, "EUR");
    const symbol = getCurrencySymbol("EUR");

    expect(screen.getByText(`${symbol} ${formatted}`)).toBeInTheDocument();
  });

  test("formats price correctly for JPY locale (no decimal)", () => {
    renderWithProviders(mockFlight, { currency: "JPY" });

    const converted = convertFromINR(mockFlight.price, "JPY");
    const formatted = formatCurrency(converted, "JPY");
    const symbol = getCurrencySymbol("JPY");

    expect(screen.getByText(`${symbol} ${formatted}`)).toBeInTheDocument();
  });
});
