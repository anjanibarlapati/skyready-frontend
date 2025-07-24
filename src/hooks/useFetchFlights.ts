
import { useDispatch } from "react-redux";
import { type SearchData } from "../redux/flightsSlice";
import { clearDepartureFlights, setDepartureError, setDepartureFlights, setDepartureMessage } from "../redux/departureFlightsSlice";

export const useFetchFlights = () => {
  const dispatch = useDispatch();

  const fetchFlights = async (searchData: SearchData) => {
    try {
      dispatch(clearDepartureFlights());
      dispatch(setDepartureMessage(""));
      dispatch(setDepartureError(""));
      const response = await fetch(
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

      const result = await response.json();

      if (response.ok) {
        dispatch(setDepartureFlights(result.flights));
      } else {
        if ( response.status === 409 ) {
          dispatch(setDepartureMessage(result.message || "No flights found"));
        } else {
          dispatch(setDepartureError(result.message || "Failed to fetch flights"));
        }
      }
    } catch {
      dispatch(setDepartureError("Something went wrong while fetching flights"));
    } finally {
       document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return { fetchFlights };
};