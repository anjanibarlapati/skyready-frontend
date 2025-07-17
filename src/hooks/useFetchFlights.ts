
import { useDispatch } from "react-redux";
import { setFlights, setMessage, type SearchData } from "../redux/flightsSlice";

export const useFetchFlights = () => {
  const dispatch = useDispatch();

  const fetchFlights = async (searchData: SearchData) => {
    try {
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
            departure_date: searchData.selectedDate,
            travellers_count: searchData.travellersCount,
            class_type: searchData.classType,
          }),
        }
      );

      const result = await response.json();

      if (response.ok) {
        dispatch(setFlights(result.flights));
      } else {
        dispatch(setFlights([]));
        dispatch(setMessage(result.message || "Failed to fetch flights."));
      }
    } catch {
      dispatch(setFlights([]));
      dispatch(setMessage("Something went wrong while fetching flights."));
    } finally {
       document.getElementById('flight-results')?.scrollIntoView({ behavior: 'smooth' });
    }
  }
  return { fetchFlights };
};
