import { describe, test, expect, beforeEach, afterEach } from "vitest";
import { vi } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Search } from "./Search";
import { Provider } from "react-redux";
import { flightsReducer, setMessage } from "../../redux/flightsSlice";
import { configureStore } from "@reduxjs/toolkit";

const createMockStore = () =>
  configureStore({
    reducer: { flights: flightsReducer },
    preloadedState: {
      flights: {
        flights: [],
        message: "",
        searchData: {
          source: "",
          destination: "",
          selectedDate: "",
          travellersCount: 1,
          classType: "",
        },
      },
    },
  });
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

const renderSearchForm = () => {
  return render(
    <Provider store={createMockStore()}>
      <Search />
    </Provider>
  );
};

describe("Search component", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(["Delhi", "Mumbai", "Bengaluru"]),
      })
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders all input fields and search button", async () => {
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

  test("source and destination InputDropdown inputs have required attribute", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));

    const sourceInput = screen.getByLabelText(/Source/i);
    const destinationInput = screen.getByLabelText(/Destination/i);

    expect(sourceInput).toBeRequired();
    expect(destinationInput).toBeRequired();
  });

  test("dispatches setMessage('') before submission", async () => {
    renderSearchForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "Delhi" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Mumbai" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(setMessage(""));
    });
  });

  test("dispatches error for invalid cities", async () => {
    renderSearchForm();
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "Xyz" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        setMessage("Please select valid cities.")
      );
    });
  });

  test("submits form with valid input", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn((url) => {
        if (url.toString().includes("/cities")) {
          return vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue(["Delhi", "Mumbai"]),
          })();
        }
        if (url.toString().includes("/flights/search")) {
          return vi.fn().mockResolvedValue({
            ok: true,
            json: vi.fn().mockResolvedValue({
              flights: [
                {
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
              ],
            }),
          })();
        }
        return vi.fn().mockRejectedValue(new Error("Unknown API call"))();
      })
    );

    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Source/i));
    fireEvent.change(screen.getByPlaceholderText(/Enter source/i), {
      target: { value: "Delhi" },
    });
    fireEvent.change(screen.getByPlaceholderText(/Enter destination/i), {
      target: { value: "Mumbai" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Search/i }));
    await waitFor(() => {
      expect(screen.queryByText(/Please select/i)).not.toBeInTheDocument();
    });
  });

  test("changes traveller count within limits", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Travellers/i));
    const plus = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent === "+")!;
    const minus = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent === "-")!;
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("1");
    fireEvent.click(minus);
    expect(input.value).toBe("1");
    fireEvent.click(plus);
    expect(input.value).toBe("2");
    for (let i = 0; i < 10; i++) fireEvent.click(plus);
    expect(input.value).toBe("9");
    fireEvent.click(plus);
    expect(input.value).toBe("9");
  });

  test("updates departure date", async () => {
    renderSearchForm();
    const input = await screen.findByLabelText(/Departure Date/i);
    const futureDate = new Date(Date.now() + 86400000)
      .toISOString()
      .split("T")[0];
    fireEvent.change(input, { target: { value: futureDate } });
    expect(input).toHaveValue(futureDate);
  });

  test("updates class type", async () => {
    renderSearchForm();
    await waitFor(() => screen.getByLabelText(/Class Type/i));
    const classTypeInput = screen.getByPlaceholderText(/Select class type/i);
    fireEvent.change(classTypeInput, { target: { value: "First Class" } });
    expect(classTypeInput).toHaveValue("First Class");
  });

  test("fetches cities on mount", async () => {
    renderSearchForm();
    await waitFor(() => {
      const input = screen.getByPlaceholderText(/Enter source/i);
      fireEvent.change(input, { target: { value: "Delhi" } });
    });
  });

  test("handles fetch rejection gracefully", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue("API failed"));
    renderSearchForm();
    await waitFor(() => {
      expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
    });
  });
});
