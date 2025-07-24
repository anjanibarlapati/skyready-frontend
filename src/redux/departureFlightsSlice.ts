import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Flight } from "../components/flight_result/FlightResult";

interface DepartureFlightsState {
  departureFlights: Flight[];
  departureMessage: string;
  departureError: string;
}
const initialState: DepartureFlightsState = {
  departureFlights: [],
  departureMessage: "",
  departureError: "",
};
const departureFlightsSlice = createSlice({
  name: "departureFlights",
  initialState,
  reducers: {
    setDepartureFlights(state, action: PayloadAction<Flight[]>) {
      state.departureFlights = action.payload;
    },
    clearDepartureFlights(state) {
      state.departureFlights = [];
    },
    setDepartureError(state, action: PayloadAction<string>) {
      state.departureError = action.payload;
    },
    setDepartureMessage(state, action: PayloadAction<string>) {
      state.departureMessage = action.payload;
    },
  },
});
export const { setDepartureFlights, setDepartureMessage,  setDepartureError, clearDepartureFlights} = departureFlightsSlice.actions;
export const departureFlightsReducer = departureFlightsSlice.reducer;