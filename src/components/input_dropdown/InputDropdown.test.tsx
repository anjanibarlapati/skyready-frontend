import { describe, test, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { InputDropdown } from "./InputDropdown";

describe("InputDropdown", () => {
  const options = ["Delhi", "Mumbai", "Bengaluru"];

  test("renders input with placeholder", () => {
    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        options={options}
        onChange={() => {}}
      />
    );
    expect(screen.getByPlaceholderText(/Select a city/i)).toBeInTheDocument();
  });

  test("shows dropdown on input click", () => {
    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        options={options}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText(/Select a city/i);
    fireEvent.click(input);

    options.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  test("filters options based on input value", () => {
    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        value=""
        options={["Delhi", "Mumbai", "Bengaluru"]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("Select a city");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "Del" } });
    expect(screen.getByText("Delhi")).toBeInTheDocument();
  });

  test("calls onChange when an option is clicked", () => {
    const mockOnChange = vi.fn();

    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        options={options}
        onChange={mockOnChange}
      />
    );

    const input = screen.getByPlaceholderText(/Select a city/i);
    fireEvent.click(input);

    const option = screen.getByText("Mumbai");
    fireEvent.click(option);

    expect(mockOnChange).toHaveBeenCalledWith("Mumbai");
  });

  test("closes dropdown when clicking outside", () => {
    render(
      <div>
        <InputDropdown
          id="city"
          name="city"
          placeholder="Select a city"
          options={options}
          onChange={() => {}}
        />
        <div data-testid="outside">Outside</div>
      </div>
    );

    const input = screen.getByPlaceholderText(/Select a city/i);
    fireEvent.click(input);

    expect(screen.getByText("Delhi")).toBeInTheDocument();

    const outside = screen.getByTestId("outside");
    fireEvent.mouseDown(outside);

    expect(screen.queryByText("Delhi")).not.toBeInTheDocument();
  });

  test("does not render options if none match input", () => {
    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        value=""
        options={["Delhi", "Mumbai", "Bengaluru"]}
        onChange={() => {}}
      />
    );

    const input = screen.getByPlaceholderText("Select a city");
    fireEvent.click(input);
    fireEvent.change(input, { target: { value: "XYZ" } });

    expect(screen.queryByText("Delhi")).not.toBeInTheDocument();
    expect(screen.queryByText("Mumbai")).not.toBeInTheDocument();
    expect(screen.queryByText("Bengaluru")).not.toBeInTheDocument();
  });
  test("does not show dropdown when showDropdown is false initially", () => {
    render(
      <InputDropdown
        id="city"
        name="city"
        placeholder="Select a city"
        value=""
        options={["Delhi", "Mumbai", "Bengaluru"]}
        onChange={() => {}}
      />
    );
    expect(screen.queryByTestId("city-list")).not.toBeInTheDocument();
  });
});
