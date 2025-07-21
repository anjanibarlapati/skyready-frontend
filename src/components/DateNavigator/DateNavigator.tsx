import React from "react";
import { useDispatch, useSelector } from "react-redux";
import "./DateNavigator.css";
import type { RootState } from "../../redux/store";
import { useFetchFlights } from "../../hooks/useFetchFlights";
import { setLoading, setSearchData } from "../../redux/flightsSlice";

export const DateNavigator: React.FC = () => {
  const { fetchFlights } = useFetchFlights();
  const dispatch = useDispatch();
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const searchData = useSelector(
    (state: RootState) => state.flights.searchData
  );
  const currentDate = new Date(searchData.selectedDate);

  const changeDate = async (days: number) => {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + days);

    const formattedDate = newDate.toLocaleDateString("en-CA");

    const updatedSearchData = {
      ...searchData,
      selectedDate: `${formattedDate} 00:00:00`,
    };
    dispatch(setSearchData(updatedSearchData));
    dispatch(setLoading(true));
    try {
      await fetchFlights(updatedSearchData);
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
        <button className="nav-btn" onClick={() => changeDate(-1)} disabled={currentDate.toLocaleDateString('en-IN') <= today.toLocaleDateString('en-IN')}>
          ←
        </button>
        <span className="current-date">{formatDate(currentDate)}</span>
        <button className="nav-btn" onClick={() => changeDate(1)}  disabled={currentDate >= new Date(new Date().setDate(today.getDate() + 7))}>
          →
        </button>
      </div>
    </>
  );
};
