import {
  convertFromINR,
  detectCurrency,
  getCurrencySymbol,
  supportedCurrencies,
} from "./currencyUtils";
import { describe, expect, it } from "vitest";

describe("convertFromINR", () => {
  it("should return same amount when converting INR to INR", () => {
    expect(convertFromINR(1000, "INR")).toBe(1000);
  });

  it("should correctly convert INR to USD", () => {
    expect(convertFromINR(1000, "USD")).toBeCloseTo(11.6, 2);
  });

  it("should correctly convert INR to EUR", () => {
    expect(convertFromINR(1000, "EUR")).toBeCloseTo(11, 2);
  });

  it("should return same amount if currency code is unknown", () => {
    expect(convertFromINR(500, "XYZ")).toBe(500);
  });
});

describe("detectCurrency", () => {
  it("should detect USD for country code 'US'", () => {
    expect(detectCurrency("US")).toBe("USD");
  });

  it("should detect EUR for country code 'FR'", () => {
    expect(detectCurrency("FR")).toBe("EUR");
  });

  it("should fallback to INR for unknown country code", () => {
    expect(detectCurrency("ZZ")).toBe("INR");
  });
});

describe("getCurrencySymbol", () => {
  it("should return ₹ for INR", () => {
    expect(getCurrencySymbol("INR")).toBe("₹");
  });

  it("should return $ for USD", () => {
    expect(getCurrencySymbol("USD")).toBe("$");
  });

  it("should return default ₹ for unknown currency code", () => {
    expect(getCurrencySymbol("XYZ")).toBe("₹");
  });

  it("should match all defined symbols correctly", () => {
    for (const { code, symbol } of supportedCurrencies) {
      expect(getCurrencySymbol(code)).toBe(symbol);
    }
  });
});
