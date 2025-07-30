import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
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
        tripType: "One Way" as 'One Way' | 'Round',
        searchData: {
          selectedDate: "",
          departureDate: "",
          source: "",
          destination: "",
          travellersCount: 1,
          classType: "Economy",
          tripType: 'One Way' as 'One Way' | 'Round'
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

  test("renders all inputs and search button", async () => {
    renderSearchForm();

    await waitFor(() => screen.findByLabelText(/Source/i));

    expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Travellers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Class Type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });

  test("dispatches currency change on dropdown select", async () => {
    renderSearchForm();
    await screen.findByRole("combobox");

    fireEvent.change(screen.getByRole("combobox"), { target: { value: "EUR" } });

    expect(mockDispatch).toHaveBeenCalledWith({
      type: "currency/setCurrency",
      payload: "EUR",
    });
  });

  test("dispatches error for invalid cities", async () => {
    renderSearchForm();
    await screen.findByLabelText(/Source/i);

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

  test("dispatches error for identical source and destination", async () => {
    renderSearchForm();
    await screen.findByLabelText(/Source/i);

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
    await screen.findByLabelText(/Source/i);

    const sourceInput = screen.getByPlaceholderText(/Enter source/i);
    const destinationInput = screen.getByPlaceholderText(/Enter destination/i);
    const swapBtn = screen.getByAltText(/swap-icon/i);

    fireEvent.change(sourceInput, { target: { value: "Mumbai" } });
    fireEvent.change(destinationInput, { target: { value: "Delhi" } });
    fireEvent.click(swapBtn);

    expect(sourceInput).toHaveValue("Delhi");
    expect(destinationInput).toHaveValue("Mumbai");
  });

  test("updates traveller count with bounds (1-9)", async () => {
    renderSearchForm();

    const minusBtn = screen.getAllByRole("button").find((b) => b.textContent === "-")!;
    const plusBtn = screen.getAllByRole("button").find((b) => b.textContent === "+")!;
    const travellerInput = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(travellerInput.value).toBe("1");

    await waitFor(()=>fireEvent.click(minusBtn));
    expect(travellerInput.value).toBe("1");

    for (let i = 0; i < 10; i++) await waitFor(()=>fireEvent.click(plusBtn));
    expect(travellerInput.value).toBe("9");
  });

  test("updates departure date correctly", async () => {
    renderSearchForm();
    const input = await screen.findByLabelText(/Departure Date/i);

    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    fireEvent.change(input, { target: { value: tomorrow } });

    expect(input).toHaveValue(tomorrow);
  });

  test("updates class type correctly", async () => {
    renderSearchForm();

    const classDropdown = screen.getByPlaceholderText(/Select class type/i);
    await waitFor(()=>fireEvent.change(classDropdown, { target: { value: "First Class" } }));

    expect(classDropdown).toHaveValue("First Class");
  });

  test("sets currency via geolocation detection", async () => {
    renderSearchForm();
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({
          type: "currency/setCurrency",
          payload: "INR",
        })
      )
    );
  });

  test("handles failed city fetch gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn((url) => {
      if (url.toString().includes("/cities")) {
        return Promise.reject("Failed to fetch cities");
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ country_code: "IN" }),
      });
    }));

    renderSearchForm();
    await screen.findByLabelText(/Source/i);
  });

  test("ensures return date cannot be before departure date", async () => {
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    const store = createMockStore();
    store.dispatch({ type: "flights/setTripType", payload: "Round" });

    render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    await screen.findByLabelText(/Return Date/i);

    const departureInput = screen.getByLabelText(/Departure Date/i);
    const returnInput = screen.getByLabelText(/Return Date/i);

    fireEvent.change(departureInput, { target: { value: tomorrow } });

    await waitFor(() => {
      expect(returnInput).toHaveAttribute("min", tomorrow);
    });
  });

  test("disables minus button when traveller count is 1", async () => {
     await act(async () => {
      renderSearchForm();
    });
    const minusBtn = screen.getAllByRole("button").find((b) => b.textContent === "-");

    expect(minusBtn).toBeDisabled();
  });

});
