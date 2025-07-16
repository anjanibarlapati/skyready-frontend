import { describe, expect, it } from "vitest";
import { journeyDuration } from "./journeyDuration";

describe("journeyDuration", () => {
  it("returns correct duration for same day flight", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-18", "12:30");
    expect(result).toBe("2h 30m");
  });

  it("returns correct duration across days", () => {
    const result = journeyDuration("2025-07-18", "22:00", "2025-07-19", "01:30");
    expect(result).toBe("3h 30m");
  });

  it("returns correct duration with day difference", () => {
    const result = journeyDuration("2025-07-18", "22:00", "2025-07-20", "01:00");
    expect(result).toBe("1d 3h");
  });

  it("returns correct duration with days, hours, and minutes", () => {
    const result = journeyDuration("2025-07-18", "22:15", "2025-07-20", "01:45");
    expect(result).toBe("1d 3h 30m");
  });

  it("returns '-' when arrival is before departure", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-17", "10:00");
    expect(result).toBe("-");
  });

  it("returns '-' when arrival is same as departure", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-18", "10:00");
    expect(result).toBe("-");
  });

  it("returns 'Failed to calculate journey duration' for invalid date input", () => {
    const result = journeyDuration("invalid-date", "10:00", "2025-07-18", "12:00");
    expect(result).toBe("Failed to calculate journey duration");
  });

  it("returns only minutes if less than 1 hour", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-18", "10:20");
    expect(result).toBe("20m");
  });

  it("returns only hours if exact hours with no minutes", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-18", "13:00");
    expect(result).toBe("3h");
  });

  it("returns only days if exact days with no remaining hours/minutes", () => {
    const result = journeyDuration("2025-07-18", "10:00", "2025-07-20", "10:00");
    expect(result).toBe("2d");
  });
});
