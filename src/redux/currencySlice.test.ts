import { setCurrency, currencyReducer } from "./currencySlice";
import type { Currency } from "./currencySlice";
import { describe, expect, it } from "vitest";

describe("currencyReducer", () => {
  const initialState: Currency = {
    currency: "INR",
  };

  it("should handle setCurrency", () => {
    const action = setCurrency("USD");
    const nextState = currencyReducer(initialState, action);
    expect(nextState.currency).toBe("USD");
  });

  it("should handle setCurrency with another value", () => {
    const action = setCurrency("EUR");
    const nextState = currencyReducer(initialState, action);
    expect(nextState.currency).toBe("EUR");
  });
});
