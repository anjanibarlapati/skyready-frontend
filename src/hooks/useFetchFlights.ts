
import { useDispatch } from "react-redux";
import { clearFlights, setError, setFlights, setMessage, type SearchData } from "../redux/flightsSlice";

export const useFetchFlights = () => {
  const dispatch = useDispatch();

  const fetchFlights = async (searchData: SearchData) => {
    try {
      dispatch(clearFlights());
      dispatch(setMessage(""));
      dispatch(setError(""));
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
        dispatch(setFlights(result.flights));
      } else {
        if ( response.status === 409 ) {
          dispatch(setMessage(result.message || "No flights found"));
        } else {
          dispatch(setError(result.message || "Failed to fetch flights"));
        }
      }
    } catch {
      dispatch(setError("Something went wrong while fetching flights"));
    } finally {
       document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return { fetchFlights };
};