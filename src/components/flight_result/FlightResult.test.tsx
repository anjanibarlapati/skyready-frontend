import { fireEvent, render, screen } from "@testing-library/react";
import { describe, test, expect, vi } from "vitest";
import { FlightResult, type Flight } from "./FlightResult";
import { MemoryRouter } from "react-router-dom";

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

const renderWithRouter = (flight: Flight) => {
  render(
    <MemoryRouter>
      <FlightResult flight={flight} />
    </MemoryRouter>
  );
};

describe("FlightResult component", () => {
  test("renders all flight details correctly", () => {
    renderWithRouter(mockFlight);

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

    renderWithRouter(flightWithoutDateDiff);

    expect(screen.queryByText("+1 day")).not.toBeInTheDocument();
  });

  test("formats price correctly with commas", () => {
    const expensiveFlight: Flight = {
      ...mockFlight,
      price: 125000,
    };

    renderWithRouter(expensiveFlight);

    expect(screen.getByText("₹ 1,25,000")).toBeInTheDocument();
  });

  test("renders the Book button", () => {
    renderWithRouter(mockFlight);
    expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
  });

    test("navigates to /confirm-booking with flight state on Book button click", () => {
    renderWithRouter(mockFlight);
    fireEvent.click(screen.getByRole("button", { name: "Book" }));

    expect(mockNavigate).toHaveBeenCalledWith("/confirm-booking", {
      state: { flight: mockFlight },
    });
  });
});
