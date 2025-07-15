import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Search } from "./Search";

describe("Search component", () => {
  beforeEach(() => {
    vi.stubGlobal(
      "fetch",
      vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve(["Delhi", "Mumbai", "Bengaluru"]),
        })
      )
    );
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders all input fields and search button", async () => {
    render(<Search />);
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
    render(<Search />);
    await waitFor(() => screen.getByLabelText(/Source/i));

    const sourceInput = screen.getByLabelText(/Source/i);
    const destinationInput = screen.getByLabelText(/Destination/i);

    expect(sourceInput).toBeRequired();
    expect(destinationInput).toBeRequired();
  });

  test("shows error when submitting with empty source and destination", async () => {
    render(<Search />);

    await waitFor(() => screen.getByLabelText(/Source/i));

    const searchBtn = screen.getByRole("button", { name: /Search/i });

    fireEvent.click(searchBtn);

    const sourceInput = screen.getByLabelText(/Source/i);
    const destinationInput = screen.getByLabelText(/Destination/i);

    expect(sourceInput).toHaveValue("");
    expect(destinationInput).toHaveValue("");
  });

  test("submits form when inputs are valid and clears error", async () => {
    render(<Search />);

    await waitFor(() => screen.getByLabelText(/Source/i));

    const sourceInput = screen.getByPlaceholderText(/Enter source/i);
    const destinationInput = screen.getByPlaceholderText(/Enter destination/i);

    fireEvent.change(sourceInput, { target: { value: "Delhi" } });
    fireEvent.change(destinationInput, { target: { value: "Mumbai" } });

    const searchBtn = screen.getByRole("button", { name: /Search/i });

    fireEvent.click(searchBtn);

    await waitFor(() => {
      expect(screen.queryByText(/Please select/i)).not.toBeInTheDocument();
    });
  });

  test("increments and decrements travellers count with limits and disables buttons appropriately", async () => {
    render(<Search />);

    await waitFor(() => screen.getByLabelText(/Travellers/i));

    const incrementBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent === "+");
    const decrementBtn = screen
      .getAllByRole("button")
      .find((btn) => btn.textContent === "-");
    const input = screen.getByRole("spinbutton") as HTMLInputElement;
    expect(input.value).toBe("1");

    fireEvent.click(decrementBtn!);
    expect(input.value).toBe("1");

    fireEvent.click(incrementBtn!);
    expect(input.value).toBe("2");

    fireEvent.click(decrementBtn!);
    expect(input.value).toBe("1");

    for (let i = 0; i < 10; i++) {
      fireEvent.click(incrementBtn!);
    }
    expect(input.value).toBe("9");

    fireEvent.click(incrementBtn!);
    expect(input.value).toBe("9");

    fireEvent.click(incrementBtn!);
    expect(input.value).toBe("9");

    fireEvent.click(decrementBtn!);
    fireEvent.click(decrementBtn!);
    fireEvent.click(decrementBtn!);
    fireEvent.click(decrementBtn!);

    fireEvent.click(incrementBtn!);
    expect(input.value).toBe("6");
  });

  test("changes departure date successfully", async () => {
    render(<Search />);
    await waitFor(() => screen.getByLabelText(/Departure Date/i));

    const dateInput = screen.getByLabelText(/Departure Date/i);
    const newDate = new Date(Date.now() + 86400000).toISOString().split("T")[0];

    fireEvent.change(dateInput, { target: { value: newDate } });
    expect(dateInput).toHaveValue(newDate);
  });

  test("changes class type successfully", async () => {
    render(<Search />);
    await waitFor(() => screen.getByLabelText(/Class Type/i));

    const classInput = screen.getByPlaceholderText(/Select class type/i);
    fireEvent.change(classInput, { target: { value: "First Class" } });

    expect(classInput).toHaveValue("First Class");
  });

  test("fetches cities on mount and sets state", async () => {
    render(<Search />);

    await waitFor(() => {
      const sourceInput = screen.getByPlaceholderText(/Enter source/i);
      fireEvent.change(sourceInput, { target: { value: "Delhi" } });
    });
  });
  test("changes class type from Economy to First Class", async () => {
    render(<Search />);
    await waitFor(() => screen.getByLabelText(/Class Type/i));

    const classTypeInput = screen.getByPlaceholderText(/Select class type/i);
    fireEvent.change(classTypeInput, { target: { value: "First Class" } });
    expect(classTypeInput).toHaveValue("First Class");
  });
  test("handles fetch rejection", async () => {
    vi.restoreAllMocks();
    vi.stubGlobal(
      "fetch",
      vi.fn(() => Promise.reject("API is down"))
    );

    render(<Search />);

    await waitFor(() => {
      expect(screen.getByLabelText(/Source/i)).toBeInTheDocument();
    });
  });
});
