import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Flight } from "../components/flight_result/FlightResult";

interface FlightsState {
  flights: Flight[];
  message: string;
}

const initialState: FlightsState = {
  flights: [],
  message: ""
};

const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setFlights(state, action: PayloadAction<Flight[]>) {
      state.flights = action.payload;
    },
    setMessage(state, action: PayloadAction<string>){
      state.message = action.payload;
    }
  },
});

export const { setFlights, setMessage } = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;
