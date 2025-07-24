import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Search } from "./Search";
import { flightsReducer } from "../../redux/flightsSlice";
import { currencyReducer } from "../../redux/currencySlice";
import { departureFlightsReducer } from "../../redux/departureFlightsSlice";

const mockDispatch = vi.fn();

vi.mock("react-redux", async () => {
  const actual = await vi.importActual<typeof import("react-redux")>("react-redux");
  return {
    ...actual,
    useDispatch: () => mockDispatch,
  };
});

const createMockStore = () =>
  configureStore({
    reducer: {
      flights: flightsReducer,
      currency: currencyReducer,
      departureFlights: departureFlightsReducer,
    },
    preloadedState: {
      flights: {
        alert: null,
        loading: false,
        searchData: {
          selectedDate: "",
          departureDate: "",
          source: "",
          destination: "",
          travellersCount: 1,
          classType: "Economy",
        },
      },
      currency: {
        currency: "USD",
      },
      departureFlights: {
        departureFlights: [],
        departureMessage: "",
        departureError: "",
      },
    },
  });

const renderSearchForm = () =>
  render(
    <Provider store={createMockStore()}>
      <Search />
    </Provider>
  );

describe("Search Component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    mockDispatch.mockClear();

    vi.stubGlobal("fetch", vi.fn((url) => {
      if (url.toString().includes("ipapi")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ country_code: "IN" }),
        });
      }

      if (url.toString().includes("/cities")) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve(["Delhi", "Mumbai", "Bengaluru"]),
        });
      }

      return Promise.reject(new Error("Unhandled fetch"));
    }));
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders all input fields and search button", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));
    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Travellers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Class Type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });

  test("currency dropdown changes dispatch action", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByRole("combobox"));
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "EUR" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "currency/setCurrency",
      payload: "EUR",
    });
  });

  test("dispatches error if cities are invalid", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), { target: { value: "FakeCity" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), { target: { value: "OtherFake" } });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "departureFlights/setDepartureError",
          payload: "Please select valid cities.",
        })
      )
    );
  });

  test("dispatches error if source and destination are same", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), { target: { value: "Delhi" } });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), { target: { value: "Delhi" } });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "departureFlights/setDepartureError",
          payload: "Source and destination cannot be same",
        })
      )
    );
  });

  test("swaps source and destination correctly", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    const sourceInput = screen.getByPlaceholderText(/Enter source/i);
    const destinationInput = screen.getByPlaceholderText(/Enter destination/i);
    const swapBtn = screen.getByAltText(/swap-icon/i);

    fireEvent.change(sourceInput, { target: { value: "Mumbai" } });
    fireEvent.change(destinationInput, { target: { value: "Delhi" } });
    fireEvent.click(swapBtn);

    expect(sourceInput).toHaveValue("Delhi");
    expect(destinationInput).toHaveValue("Mumbai");
  });

  test("travellers count updates correctly within bounds", async () => {
    renderSearchForm();

    const minus = screen.getAllByRole("button").find((b) => b.textContent === "-")!;
    const plus = screen.getAllByRole("button").find((b) => b.textContent === "+")!;
    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(input.value).toBe("1");
    fireEvent.click(minus);
    expect(input.value).toBe("1");

    for (let i = 0; i < 5; i++) fireEvent.click(plus);
    expect(input.value).toBe("6");

    for (let i = 0; i < 5; i++) fireEvent.click(plus);
    expect(input.value).toBe("9");

    fireEvent.click(plus);
    expect(input.value).toBe("9");
  });

  test("departure date changes and stays valid", async () => {
    renderSearchForm();
    const input = await screen.findByLabelText(/Departure Date/i);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    fireEvent.change(input, { target: { value: tomorrow } });
    expect(input).toHaveValue(tomorrow);
  });

  test("class type updates correctly", async () => {
    renderSearchForm();
    const input = await screen.findByPlaceholderText(/Select class type/i);
    fireEvent.change(input, { target: { value: "First Class" } });
    expect(input).toHaveValue("First Class");
  });

  test("sets currency on geolocation detection", async () => {
    renderSearchForm();
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "currency/setCurrency", payload: "INR" })
      )
    );
  });

  test("handles failed city fetch gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce("Failed to fetch cities"));
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));
  });
});
