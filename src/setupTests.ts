import '@testing-library/jest-dom';
import { afterAll, beforeAll } from 'vitest';
const originalConsoleError = console.error;

beforeAll(() => {
  console.error = (...args: unknown[]) => {
    const [message] = args;
    if (
      typeof message === "string" &&
      message.includes("An update to") &&
      message.includes("was not wrapped in act")
    ) {
      return; 
    }
    originalConsoleError(...args); 
  };
});

afterAll(() => {
  console.error = originalConsoleError;
});