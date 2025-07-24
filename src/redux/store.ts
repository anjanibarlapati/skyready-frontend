import { configureStore } from "@reduxjs/toolkit";
import { flightsReducer } from "./flightsSlice";
import { currencyReducer } from "./currencySlice";
import { departureFlightsReducer } from "./departureFlightsSlice";
import { returnFlightsReducer } from "./returnFlightsSlice";

export const store = configureStore({
  reducer: {
    flights: flightsReducer,
    currency: currencyReducer,
    departureFlights: departureFlightsReducer,
    returnFlights: returnFlightsReducer
  },
});

export type RootState = ReturnType<typeof store.getState>;
