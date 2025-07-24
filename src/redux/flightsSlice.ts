import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
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
  departureDate: string;
  tripType: 'One Way' | 'Round',
  selectedReturnDate?: string;
  returnDate?: string;
}
export interface FlightsState {
  alert: Alert | null;
  searchData: SearchData;
  loading: boolean;
  tripType: 'One Way' | 'Round'
}
const initialState: FlightsState = {
  alert: null,
  loading: false,
  searchData: {
    selectedDate: new Date().toLocaleDateString("en-CA").split("T")[0],
    departureDate: new Date().toLocaleDateString("en-CA").split("T")[0],
    source: "",
    destination: "",
    travellersCount: 1,
    classType: "Economy",
    tripType: 'One Way'
  },
  tripType: 'One Way'
};
const flightsSlice = createSlice({
  name: "flights",
  initialState,
  reducers: {
    setAlert(state, action: PayloadAction<Alert>) {
      state.alert = action.payload;
    },
    clearAlert(state) {
      state.alert = null;
    },
    setSearchData( state, action: PayloadAction<SearchData> ) {
      state.searchData = action.payload
    },
    setLoading(state, action : PayloadAction<boolean>) {
      state.loading = action.payload;
    },
    setTripType(state, action: PayloadAction<'One Way' | 'Round'> ) {
      state.tripType = action.payload
    }
  },
});
export const {setAlert, clearAlert, setSearchData, setLoading, setTripType } = flightsSlice.actions;
export const flightsReducer = flightsSlice.reducer;

