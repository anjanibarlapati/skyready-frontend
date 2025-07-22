import type { PayloadAction } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";

export interface Currency {
  currency: string;
}

const initialState: Currency = {
  currency: 'INR'
};
const currencySlice = createSlice({
  name: "currency",
  initialState,
  reducers: {
    setCurrency(state, action: PayloadAction<string>) {
      state.currency = action.payload;
    },
  },
});
export const { setCurrency } = currencySlice.actions;
export const currencyReducer = currencySlice.reducer;