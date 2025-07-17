import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import type { Flight } from "../components/flight_result/FlightResult";

export interface Alert {
  type: "success" | "failure";
  message: string;
}
export interface SearchData {
  selectedDate: string;
  source: string;
  destination: string;
  travellersCount: number;
  classType: string;
}
interface FlightsState {
  flights: Flight[];
  message: string;
  alert: Alert | null;
  searchData: SearchData;
}
const initialState: FlightsState = {
  flights: [],
  message: "",
  alert: null,
  searchData: {
    selectedDate: new Date().toISOString().split("T")[0],
    source: "",
    destination: "",
    travellersCount: 1,
    classType: "Economy",
  },
};
const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setFlights(state, action: PayloadAction<Flight[]>) {
      state.flights = action.payload;
    },
    clearFlights(state) {
      state.flights = [];
    },
    setMessage(state, action: PayloadAction<string>) {
      state.message = action.payload;
    },
    setAlert(state, action: PayloadAction<Alert>) {
      state.alert = action.payload;
    },
    clearAlert(state) {
      state.alert = null;
    },
    setSearchData(
      state,
      action: PayloadAction<Partial<FlightsState["searchData"]>>
    ) {
      state.searchData = {
        ...state.searchData,
        ...action.payload,
      };
    },
  },
});
export const {
  setFlights,
  setMessage,
  setAlert,
  clearAlert,
  clearFlights,
  setSearchData,
} = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;