export const supportedCurrencies = [
  { code: "INR", label: "Indian Rupee (₹)", symbol: "₹" },
  { code: "USD", label: "US Dollar ($)", symbol: "$" },
  { code: "EUR", label: "Euro (€)", symbol: "€" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" },
  { code: "JPY", label: "Japanese Yen (¥)", symbol: "¥" },
];

const INR_TO_CURRENCY: Record<string, number> = {
  INR: 1,
  USD: 0.0116,
  EUR: 0.011,
  GBP: 0.0095,
  JPY: 1.71,
};

export function convertFromINR(amount: number, to: string): number {
  const rate = INR_TO_CURRENCY[to] || 1;
  return amount * rate;
}

const localeToCurrency: Record<string, string> = {
  "US": "USD",
  "GB": "GBP",
  "IN": "INR",
  "FR": "EUR",
  "DE": "EUR",
  "JP": "JPY",
};

export function detectCurrency(countryCode: string): string {
  return localeToCurrency[countryCode] || "INR";
}

export function getCurrencySymbol(code: string): string {
  return supportedCurrencies.find((c) => c.code === code)?.symbol || "₹";
}

function getLocaleForCurrency(currencyCode: string): string {
  switch (currencyCode) {
    case "INR":
      return "en-IN";
    case "USD":
      return "en-US";
    case "EUR":
      return "de-DE";
    case "GBP":
      return "en-GB";
    case "JPY":
      return "ja-JP";
    default:
      return "en-IN";
  }
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const locale = getLocaleForCurrency(currencyCode);
  
  return `${amount.toLocaleString(locale, {
    maximumFractionDigits: 2,
  })}`;
}