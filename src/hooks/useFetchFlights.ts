import { useDispatch, useSelector } from "react-redux";
import { clearDepartureFlights, setDepartureMessage, setDepartureError, setDepartureFlights } from "../redux/departureFlightsSlice";
import type { SearchData } from "../redux/flightsSlice";
import { clearReturnFlights, setReturnMessage, setReturnError, setReturnFlights } from "../redux/returnFlightsSlice";
import type { RootState } from "../redux/store";

export const useFetchFlights = () => {
  const dispatch = useDispatch();
  const tripType = useSelector((state: RootState) => state.flights.tripType);

  const fetchFlights = async (
    searchData: SearchData,
    type: "departure" | "return" | "both" = "both"
  ) => {
    try {

      if(type === 'both') {
        dispatch(clearDepartureFlights());
        dispatch(setDepartureMessage(""));
        dispatch(setDepartureError(""));
        dispatch(clearReturnFlights());
        dispatch(setReturnMessage(""));
        dispatch(setReturnError(""));
      }
      if (type === "departure" || type === "both") {
        dispatch(clearDepartureFlights());
        dispatch(setDepartureMessage(""));
        dispatch(setDepartureError(""));

        const departureResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/flights/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source: searchData.source,
              destination: searchData.destination,
              departure_date: searchData.departureDate,
              travellers_count: searchData.travellersCount,
              class_type: searchData.classType,
            }),
          }
        );
        const departureResult = await departureResponse.json();

        if (departureResponse.ok) {
          dispatch(setDepartureFlights(departureResult.flights));
        } else {
          if (departureResponse.status === 409) {
            dispatch(setDepartureMessage(departureResult.message || "No departure flights found"));
          } else {
            dispatch(setDepartureError(departureResult.message || "Failed to fetch departure flights"));
          }
        }
      }


      if (tripType === "Round" && (type === "return" || type === "both")) {

        dispatch(clearReturnFlights());
        dispatch(setReturnMessage(""));
        dispatch(setReturnError(""));
        const returnResponse = await fetch(
          `${import.meta.env.VITE_BASE_URL}/api/v1/flights/search`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              source: searchData.destination,
              destination: searchData.source,
              departure_date: searchData.returnDate,
              travellers_count: searchData.travellersCount,
              class_type: searchData.classType,
            }),
          }
        );
        const returnResult = await returnResponse.json();


        if (returnResponse.ok) {
          dispatch(setReturnFlights(returnResult.flights));
        } else {
          if (returnResponse.status === 409) {
            dispatch(setReturnMessage(returnResult.message || "No return flights found"));
          } else {
            dispatch(setReturnError(returnResult.message || "Failed to fetch return flights"));
          }
        }
      }
    } catch {
      if (type === "departure" || type === "both") {
        dispatch(setDepartureError("Something went wrong while fetching departure flights"));
      }
      if ((type === "return" || type === "both") && tripType === "Round") {
        dispatch(setReturnError("Something went wrong while fetching return flights"));
      }
    } finally {
      document.getElementById("flight-results")?.scrollIntoView({ behavior: "smooth" });
    }
  };

  return { fetchFlights };
};
