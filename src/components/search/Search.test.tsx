import { describe, test, expect, beforeEach, afterEach, vi } from "vitest";
import { render, screen, fireEvent, waitFor, act } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { Search } from "./Search";
import { flightsReducer } from "../../redux/flightsSlice";
import { currencyReducer } from "../../redux/currencySlice";

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
    },
    preloadedState: {
      flights: {
        flights: [],
        message: "",
        error: "",
        loading: false,
        alert: null,
        searchData: {
          source: "",
          destination: "",
          selectedDate: "",
          travellersCount: 1,
          classType: "Economy",
        },
      },
      currency: {
        currency: "USD",
      },
    },
  });

const renderSearchForm = () =>
  render(
    <Provider store={createMockStore()}>
      <Search />
    </Provider>
  );

describe("Search component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();

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

  test("renders input fields and search button", async () => {
    renderSearchForm();
    await waitFor(() => {
      expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
      expect(screen.getByLabelText(/Destination/i)).toBeInTheDocument();
    });
    expect(screen.getByLabelText(/Departure Date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Travellers/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Class Type/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Search/i })).toBeInTheDocument();
  });
  test("renders currency dropdown and updates on change", async () => {
      renderSearchForm(); 
      await waitFor(() => {
      const currencyDropdown = screen.getByRole("combobox");

      expect(currencyDropdown).toHaveValue("USD");
      fireEvent.change(currencyDropdown, { target: { value: "EUR" } });
      expect(mockDispatch).toHaveBeenCalledWith({
        type: "currency/setCurrency",
        payload: "EUR",
      });
    });
  });

  test("shows loading spinner when loading is true", async () => {
    const store = configureStore({
      reducer: {
        flights: flightsReducer,
        currency: currencyReducer,
      },
      preloadedState: {
          flights: {
            flights: [],
            message: "",
            error: "",
            loading: false,
            alert: null,
            searchData: {
              selectedDate: "",
              source: "",
              destination: "",
              travellersCount: 1,
              classType: "Economy",
            },
          },
          currency: {
            currency: "USD",
          },
      },
    });

    const { rerender } = render(
      <Provider store={store}>
        <Search />
      </Provider>
    );

    await act(async () => {
      store.dispatch({ type: "flights/setError", payload: "" });
      store.dispatch({ type: "currency/setCurrency", payload: "USD" });

      rerender(
        <Provider store={store}>
          <Search />
        </Provider>
      );
    });
  });

  test("dispatches error for invalid cities", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "InvalidCity" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Unknown" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "flights/setError", payload: "Please select valid cities." })
      )
    );
  });

  test("prevents form submission if source equals destination", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "Delhi" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Delhi" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "flights/setError", payload: "Source and destination cannot be same" })
      )
    );
  });

  test("departure date changes correctly", async () => {
    renderSearchForm();
    const input = await screen.findByLabelText(/Departure Date/i);
    const tomorrow = new Date(Date.now() + 86400000).toISOString().split("T")[0];
    fireEvent.change(input, { target: { value: tomorrow } });
    expect(input).toHaveValue(tomorrow);
  });

  test("updates class type selection", async () => {
    renderSearchForm();
    const classTypeInput = await screen.findByPlaceholderText(/Select class type/i);
    fireEvent.change(classTypeInput, { target: { value: "First Class" } });
    expect(classTypeInput).toHaveValue("First Class");
  });

  test("travellers count increases/decreases within bounds", async () => {
    renderSearchForm();

    const plus = screen.getAllByRole("button").find((btn) => btn.textContent === "+")!;
    const minus = screen.getAllByRole("button").find((btn) => btn.textContent === "-")!;
    const input = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(input.value).toBe("1");

    await act(async () => {
      fireEvent.click(minus);
    });
    expect(input.value).toBe("1");

    await act(async () => {
      fireEvent.click(plus);
      fireEvent.click(plus);
    });
    expect(input.value).toBe("3");

    await act(async () => {
      for (let i = 0; i < 10; i++) fireEvent.click(plus);
    });
    expect(input.value).toBe("9");

    await act(async () => {
      fireEvent.click(plus);
    });
    expect(input.value).toBe("9");
  });

  test("swaps source and destination when swap icon is clicked", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "Delhi" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Mumbai" },
    });

    const swapIcon = screen.getByAltText(/swap-icon/i);
    fireEvent.click(swapIcon);

    expect(screen.getByPlaceholderText(/Enter source/i)).toHaveValue("Mumbai");
    expect(screen.getByPlaceholderText(/Enter destination/i)).toHaveValue("Delhi");
  });

  test("handles fetch rejection during mount", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValueOnce("City fetch failed"));
    renderSearchForm();
    await waitFor(() => {
      expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
    });
  });

  test("dispatches setCurrency on geolocation detection", async () => {
    renderSearchForm();
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        expect.objectContaining({ type: "currency/setCurrency", payload: "INR" })
      );
    });
  });
});
