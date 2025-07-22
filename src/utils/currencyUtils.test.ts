import {
  convertFromINR,
  detectCurrency,
  formatCurrency,
  getCurrencySymbol,
  supportedCurrencies,
} from "./currencyUtils";
import { describe, expect, it } from "vitest";

describe("Convert from INR to selected currency", () => {
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

describe("Detect currency", () => {
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

describe("Get currency symbol", () => {
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

describe("Format currency", () => {
  it("should format INR correctly (Indian comma style)", () => {
    expect(formatCurrency(125000, "INR")).toBe("1,25,000");
  });

  it("should format USD correctly", () => {
    expect(formatCurrency(125000, "USD")).toBe("125,000");
  });

  it("should format EUR correctly", () => {
    expect(formatCurrency(125000, "EUR")).toBe("125.000");
  });

  it("should format GBP correctly", () => {
    expect(formatCurrency(125000, "GBP")).toBe("125,000");
  });

  it("should format JPY correctly", () => {
    expect(formatCurrency(125000, "JPY")).toBe("125,000");
  });

  it("should default to en-IN for unknown currency code", () => {
    expect(formatCurrency(125000, "XYZ")).toBe("1,25,000");
  });

  it("should keep max 2 decimal digits", () => {
    expect(formatCurrency(123456.789, "USD")).toBe("123,456.79");
  });

});



