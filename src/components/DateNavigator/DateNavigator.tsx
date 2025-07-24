import { useDispatch, useSelector } from "react-redux";
import "./DateNavigator.css";
import type { RootState } from "../../redux/store";
import { useFetchFlights } from "../../hooks/useFetchFlights";
import { setLoading, setSearchData } from "../../redux/flightsSlice";

export const DateNavigator = ({type}: {type: 'return' | 'departure'}) => {
  const { fetchFlights } = useFetchFlights();
  const dispatch = useDispatch();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const searchData = useSelector( (state: RootState) => state.flights.searchData );
  
  const selectedDate = (type === 'return' && searchData.selectedReturnDate) ? new Date(searchData.selectedReturnDate):  new Date(searchData.selectedDate) ;  
  const departureDate = (type === 'return' && searchData.returnDate) ? new Date(searchData?.returnDate) : new Date(searchData.departureDate);

  const minDate = new Date(Math.max(
    today.getTime(),
    new Date(selectedDate).setDate(selectedDate.getDate() - 7)
  ));

  const twoMonthsFromToday = new Date(today);
  twoMonthsFromToday.setMonth(today.getMonth() + 2);

  const maxDate = new Date(Math.min(
    new Date(selectedDate).setDate(selectedDate.getDate() + 7),
    twoMonthsFromToday.getTime()
  ));

  
  const changeDate = async (days: number) => {
    const newDate = new Date(departureDate);
    newDate.setDate(departureDate.getDate() + days);
    if (newDate < minDate || newDate > maxDate) return;

    const formattedDate = newDate.toLocaleDateString("en-CA");

      const updatedSearchData = (type === 'departure') ? {
        ...searchData,
        departureDate : formattedDate,
      } : {
        ...searchData,
        returnDate : formattedDate,
      };


    dispatch(setSearchData(updatedSearchData));
    dispatch(setLoading(true));
    try {
      await fetchFlights(updatedSearchData, type);
    } finally {
      dispatch(setLoading(false));
    }
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });

  return (
    <>
      <div className="date-nav-container">
        <button className="nav-btn" onClick={() => changeDate(-1)} disabled={departureDate.setHours(0, 0, 0, 0) <= minDate.setHours(0, 0, 0, 0)}>
          ←
        </button>
        <span className="current-date">{formatDate(departureDate)}</span>
        <button className="nav-btn" onClick={() => changeDate(1)}  disabled={departureDate.setHours(0, 0, 0, 0) >= maxDate.setHours(0, 0, 0, 0)}>
          →
        </button>
      </div>
    </>
  );
};