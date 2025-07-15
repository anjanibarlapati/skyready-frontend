import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { FlightResult, type Flight } from "./FlightResult";

const mockFlight: Flight = {
  airline_name: "IndiGo",
  flight_number: "6E123",
  departure_time: "08:00 AM",
  arrival_time: "10:30 AM",
  arrival_date_difference: "+1 day",
  source: "Delhi",
  destination: "Mumbai",
  seats: 5,
  price: 3500,
};

describe("FlightResult component", () => {
  test("renders all flight details correctly", () => {
    render(<FlightResult flight={mockFlight} />);

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
    const flightWithoutDateDiff = { ...mockFlight, arrival_date_difference: undefined };

    render(<FlightResult flight={flightWithoutDateDiff} />);

    expect(screen.queryByText("+1 day")).not.toBeInTheDocument();
  });

  test("formats price correctly with commas", () => {
    const expensiveFlight = { ...mockFlight, price: 125000 };

    render(<FlightResult flight={expensiveFlight} />);

    expect(screen.getByText("₹ 1,25,000")).toBeInTheDocument();
  });

  test("shows Book button by default", () => {
    render(<FlightResult flight={mockFlight} />);
    expect(screen.getByRole("button", { name: "Book" })).toBeInTheDocument();
  });

 
});
