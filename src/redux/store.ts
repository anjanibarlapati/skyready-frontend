import { configureStore } from "@reduxjs/toolkit";
import { flightsReducer } from "./flightsSlice";
import { currencyReducer } from "./currencySlice";

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    currency: currencyReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
