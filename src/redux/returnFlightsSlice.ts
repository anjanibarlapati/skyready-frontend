import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Flight } from "../components/flight_result/FlightResult";

interface ReturnFlightsState {
  returnFlights: Flight[];
  returnMessage: string;
  returnError: string;
}
const initialState: ReturnFlightsState = {
  returnFlights: [],
  returnMessage: "",
  returnError: "",
};
const returnFlightsSlice = createSlice({
  name: "returnFlights",
  initialState,
  reducers: {
    setReturnFlights(state, action: PayloadAction<Flight[]>) {
      state.returnFlights = action.payload;
    },
    clearReturnFlights(state) {
      state.returnFlights = [];
    },
    setReturnError(state, action: PayloadAction<string>) {
      state.returnError = action.payload;
    },
    setReturnMessage(state, action: PayloadAction<string>) {
      state.returnMessage = action.payload;
    },
  },
});
export const { setReturnFlights, setReturnMessage,  setReturnError, clearReturnFlights} = returnFlightsSlice.actions;
export const returnFlightsReducer = returnFlightsSlice.reducer;