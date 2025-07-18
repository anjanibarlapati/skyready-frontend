import { render, screen } from "@testing-library/react";
import { describe, test, expect } from "vitest";
import { LoadingSpinner } from "./LoadingSpinner";

describe("LoadingSpinner component", () => {
  test("renders spinner container", () => {
    render(<LoadingSpinner />);
    const spinner = screen.getByTestId("spinner");
    expect(spinner).toBeInTheDocument();
  });
});
